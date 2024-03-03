const { firebaseAdmin } = require('./firebase'); // Import Firebase Admin

const updateUser = async (params) => {
    const id = params.oldId !== 'none' ? params.oldId : params.id;
    try {
        await firebaseAdmin.collection('users').doc(id).set({
            name: params.name,
            id: params.id
        }, { merge: true });
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

const getUserName = async (userId) => {
    try {
        const userDoc = await firebaseAdmin.collection('users').doc(userId).get();
        if (userDoc.exists) {
            return userDoc.data().name;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user name:', error);
        return null;
    }
};

const createGame = async (data) => {
    try {
        await firebaseAdmin.collection('games').add(data);
    } catch (error) {
        console.error('Error creating game:', error);
    }
};

const getGameById = async (id) => {
    try {
        const gameDoc = await firebaseAdmin.collection('games').doc(id).get();
        if (gameDoc.exists) {
            return gameDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting game by ID:', error);
        return null;
    }
};

const updateGameById = async (id, data) => {
    try {
        await firebaseAdmin.collection('games').doc(id).set(data, { merge: true });
        if (data.status && data.status === 'finished') {
            await updatePoints(data.gameId);
        }
    } catch (error) {
        console.error('Error updating game by ID:', error);
    }
};

const updatePoints = async (gameId) => {
    try {
        const gameDoc = await firebaseAdmin.collection('games').doc(gameId).get();
        if (gameDoc.exists) {
            const gameData = gameDoc.data();
            if (!gameData.pointsCounted) {
                const points = gameData.score.x - gameData.score.o;
                let toUpdate = gameData.users.x;
                if (points <= 0) {
                    toUpdate = gameData.users.o;
                }
                await firebaseAdmin.collection('users').doc(toUpdate).update({
                    points: firebaseAdmin.firestore.FieldValue.increment(Math.abs(points))
                });
                await firebaseAdmin.collection('games').doc(gameId).update({
                    pointsCounted: true
                });
            }
        }
    } catch (error) {
        console.error('Error updating points:', error);
    }
};

module.exports = {
    getGameById,
    createGame,
    updateGameById,
    updateUser,
    getUserName,
};
