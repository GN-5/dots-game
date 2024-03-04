import { database } from './firebase';
import { ref, set } from 'firebase/database';
const db = database;



export async function createUser(data) {
    try {
        await set(ref(db, 'users').push().data);
    }
    catch (error) {
        console.log(error);
    }
}
export async function updateUser(params) {
    const id = params.oldId !== 'none' ? params.oldId : params.id;
    try {
        await set(ref(db, 'users/' + id), {
            name: params.name,
            id: params.id
        });
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

export async function getUserName(userId) {
    try {
        const userSnapshot = await db.ref('users/' + userId).once('value');
        const userData = userSnapshot.val();
        return userData ? userData.name : null;
    } catch (error) {
        console.error('Error getting user name:', error);
        return null;
    }
}

export async function createGame(data) {
    try {
        await set(ref(db, 'Game').push(), data);
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
        await set(ref(db, 'Game/' + id), data);
        if (data.status && data.status === 'finished') {
            await updatePoints(data.gameId);
        }
    } catch (error) {
        console.error('Error updating game by ID:', error);
    }
}

export async function updatePoints(gameId) {
    try {
        const gameSnapshot = await db.ref('Game/' + gameId).once('value');
        const gameData = gameSnapshot.val();
        if (gameData && !gameData.pointsCounted) {
            const points = gameData.score.x - gameData.score.o;
            let toUpdate = gameData.users.x;
            if (points <= 0) {
                toUpdate = gameData.users.o;
            }
            await db.ref('users/' + toUpdate + '/points').transaction(currentPoints => currentPoints + Math.abs(points));
            await db.ref('Game/' + gameId + '/pointsCounted').set(true);
        }
    } catch (error) {
        console.error('Error updating points:', error);
    }
}
