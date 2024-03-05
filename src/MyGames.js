import React, { useEffect, useState } from 'react';
import { auth, database } from "./server/firebase";
import { ref, onValue, } from "firebase/database";

const MyGames = () => {
    const [games, setGames] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Get username from Firebase Auth
        const user = auth.currentUser;
        if (user) {
            setUsername(user.username);
        }

        // Fetch games data from Firebase Realtime Database
        const gamesRef = ref(database, 'games');
        onValue(gamesRef, (snapshot) => {
            const gamesData = snapshot.val();
            const gamesList = [];
            for (let gameId in gamesData) {
                gamesList.push({
                    gameId: gameId,
                    player: {
                        x: gamesData[gameId].player.x,
                        o: gamesData[gameId].player.o
                    },
                    points: {
                        x: gamesData[gameId].points.x,
                        o: gamesData[gameId].points.o
                    },
                    size: {
                        r: gamesData[gameId].size.r,
                        c: gamesData[gameId].size.c
                    }
                });
            }
            setGames(gamesList);
        });

        // Unsubscribe from gamesRef on component unmount
        return () => {
            gamesRef.off();
        };
    }, []);

    return (
        <div className="container is-centered">
            <h1 className="is-centered">My Games</h1>
            <p className='subtitle has-text-grey'>Hello {username}, here are your games:</p>
            <div className="table-container is-centered">
                <table className="table is-bordered is-hoverable is-centered">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Game ID</th>
                            <th>Player (X)</th>
                            <th>Player (O)</th>
                            <th>Points (X)</th>
                            <th>Points (O)</th>
                            <th>Size (R)</th>
                            <th>Size (C)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game, index) => (
                            <tr key={game.gameId}>
                                <td>{index + 1}</td>
                                <td>{game.gameId}</td>
                                <td>{game.player.x}</td>
                                <td>{game.player.o}</td>
                                <td>{game.points.x}</td>
                                <td>{game.points.o}</td>
                                <td>{game.size.r}</td>
                                <td>{game.size.c}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyGames;
