const { siteUrl } = require('./config');

module.exports = server => {
    const io = require('socket.io')(server, { origins: siteUrl + ':*' });
    const Storage = require('./Storage');

    // A new User (CLIENT) is Connected
    io.on('connection', socket => {

        //When the CLIENT wants to start a new Game
        socket.on('NEW_GAME', data => {
            Storage.createGame(data).then(() => {
                if (!data.public) return;
                //Update all the connected users, except CLIENT, with this new game link
                Storage.getPublicGames().then(games => socket.broadcast.emit('UPDATE_GAME_LIST', games));
            });

            socket.on('disconnect', () => {
                Storage.getGameById(data.gameId).then(game => {
                    if (game.status !== 'waiting_for_opponent') return;
                    Storage.updateGameById(data.gameId, { public: false })
                        .then(() => {
                            Storage.getPublicGames().then(games => io.emit('UPDATE_GAME_LIST', games));
                        })
                });
            });
        });

        socket.on('JOIN_GAME', data => {
            // leave all previous games
            leaveRooms(socket);

            socket.join(data.gameId);
            // console.log(data.userId + ' joined... ' + data.gameId)

            Storage.getGameById(data.gameId).then(game => {
                if (!game) {
                    socket.emit('SYNC', { status: 'not_found' });
                    return;
                }
                if (game.status === 'waiting_for_opponent' && game.users.x != data.userId) {
                    game.status = 'started';
                    game.users.o = data.userId;
                }

                const isX = game.users.x === data.userId;
                const isO = game.users.o === data.userId;

                if (isX) {
                    game.connected.x = true;
                } else if (isO) {
                    game.connected.o = true;
                }
                const update = {
                    status: game.status,
                    users: game.users,
                    connected: game.connected,
                };

                // send to clinet game info
                socket.emit('SYNC', {
                    ...game,
                    ...{
                        isX: game.users.x === data.userId,
                    }
                });

                socket.on('disconnect', () => {
                    Storage.getGameById(data.gameId).then(game => {
                        if (isX) {
                            game.connected.x = false;
                        } else if (isO) {
                            game.connected.o = false;
                        }
                        Storage.updateGameById(data.gameId, { connected: game.connected });
                        socket.broadcast.to(data.gameId).emit('SYNC', {
                            connected: game.connected
                        });
                    });
                });
            });
        });

        socket.on('REQUEST_GAME_INFO', data => {
            // console.log('request from', data.userId, 'for', data.gameId);
            Storage.getGameById(data.gameId).then(game => {
                if (!game) {
                    socket.emit('SYNC', {
                        status: 'not_found',
                    });
                    return;
                }
                // console.log('Sent ', data.gameId, ' to ', data.userId);
                socket.emit('SYNC', {
                    ...game,
                    ...{
                        isX: game.users.x === data.userId,
                    }
                });
            });
        });

        socket.on('SYNC', data => {
            Storage.updateGameById(data.gameId, data);
            socket.broadcast.to(data.gameId).emit('SYNC', data);
        });

        socket.on('REJOIN', data => {
            socket.join(data.gameId);
            Storage.getGameById(data.gameId).then(game => {
                if (!game) return;
                const isX = game.users.x === data.userId;
                const isO = game.users.o === data.userId;
                if (isX) {
                    game.connected.x = true;
                } else if (isO) {
                    game.connected.o = true;
                }
                Storage.updateGameById(data.gameId, { connected: game.connected });

                socket.emit('SYNC', {
                    connected: game.connected
                });
            });
        });
    });

    const leaveRooms = socket => {
        Object.keys(socket.rooms).forEach(room => {
            socket.leave(room);
        });
    };
};
