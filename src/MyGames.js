import React, { useEffect, useState } from 'react';
import { auth, database } from "./server/firebase";
import { ref, onValue, off } from "firebase/database";
import { useHistory } from "react-router-dom";
import { getUsername } from './server/Storage';
const MyGames = () => {
    const [games, setGames] = useState([]);
    const [username, setUsername] = useState('');
    const history = useHistory();

    useEffect(() => {
        // Get username from Firebase Auth
        const user = auth.currentUser;
        if (user) {
            async function fetchData(uid) {
                try {
                    const fetchedUsername = await getUsername(uid);
                    setUsername(fetchedUsername);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
            fetchData(user.uid);
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
            off(gamesRef);
        };
    }, []);

    const handleUpdateUserClick = () => {
        // Redirect to UpdateUser component
        history.push('/update');
    };

    return (
        <div className="field is-widescreen">
            <h1 className="is-dark is-size-1">My Games</h1>
            <p className='subtitle has-text-grey'>Hello {username}, here are your games:</p>
            <div className="table-container is-centered" style={{ width: '100vw', overflowX: 'auto' }}>
                <table className="table is-bordered is-hoverable is-centered is-6" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Game ID</th>
                            <th>Opponent</th>
                            <th>Points (You)</th>
                            <th>Points (Opponent)</th>
                            <th>Size (Row)</th>
                            <th>Size (Col)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game, index) => (
                            <tr key={game.gameId}>
                                <td>{index + 1}</td>
                                <td>{game.gameId}</td>
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
            <button onClick={() => handleUpdateUserClick()}>Update Username</button>
        </div >
    );
}

export default MyGames;
