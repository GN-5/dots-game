import { database } from './firebase';
import { ref, set, get, child, update } from 'firebase/database';
const db = database;

export async function createUser(uid, email) {
    try {
        await set(ref(db, `User/ ${uid}`), {
            uID: uid,
            username: email.split('@')[0],
            email: email,
            games: {}
        });
    }
    catch (error) {
        console.log(error);
    }
}
export async function updateUsername(uid, newUsername) {
    try {
        const userRef = ref(db, `User/ ${uid}`);
        console.log(uid, newUsername.toString(), userRef);
        await update(userRef, { username: newUsername.toString() });
    } catch (error) {
        console.log("error Occured");
        throw error;
    }
};

export async function getUsername(uid) {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, `User/ ${uid}/username`));
        if (snapshot.exists()) {
            console.log(snapshot.val());
            return snapshot.val().toString();
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

export async function createGame(uid, gameData) {
    try {
        await set(ref(db, `User/ ${uid}/games/${gameData.gameId}`), {
            gameID: gameData.gameId,
            opponent: gameData.players.o,
            score: {
                x: gameData.score.x,
                o: gameData.score.o,
            },
            size: {
                r: gameData.size.r,
                c: gameData.size.c
            },

            gameState: {}
        });
    } catch (error) {
        console.error('Error creating game:', error);
    }
}

export async function getGameById(id) {
    try {
        const gameSnapshot = await db.ref('Game/' + id).once('value');
        const gameData = gameSnapshot.val();
        return gameData;
    } catch (error) {
        console.error('Error getting game by ID:', error);
        return null;
    }
}

export async function updateGameById(id, data) {
    try {
        await set(ref(db, 'games/' + id), data);
        if (data.status && data.status === 'finished') {
            await updatePoints(data.gameId);
        }
    } catch (error) {
        console.error('Error updating game by ID:', error);
    }
}

export async function updatePoints(gameId) {
    try {
        const gameSnapshot = await db.ref('games/' + gameId).once('value');
        const gameData = gameSnapshot.val();
        if (gameData && !gameData.pointsCounted) {
            const points = gameData.score.x - gameData.score.o;
            let toUpdate = gameData.users.x;
            if (points <= 0) {
                toUpdate = gameData.users.o;
            }
            await db.ref('users/' + toUpdate + '/points').transaction(currentPoints => currentPoints + Math.abs(points));
            await db.ref('games/' + gameId + '/pointsCounted').set(true);
        }
    } catch (error) {
        console.error('Error updating points:', error);
    }
}
