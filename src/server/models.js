import { database } from './firebase';
const db = database;


const User = {
	create: async (userData) => {
		try {
			await db.ref('users/' + userData.id).set(userData);
		} catch (error) {
			console.error('Error creating user:', error);
		}
	},
	get: async (userId) => {
		try {
			const userSnapshot = await db.ref('users/' + userId).once('value');
			const userData = userSnapshot.val();
			return userData;
		} catch (error) {
			console.error('Error getting user:', error);
			return null;
		}
	},
	update: async (userId, newData) => {
		try {
			await db.ref('users/' + userId).update(newData);
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}
};

const Game = {
	create: async (gameData) => {
		try {
			await db.ref('games/' + gameData.gameId).set(gameData);
		} catch (error) {
			console.error('Error creating game:', error);
		}
	},
	get: async (gameId) => {
		try {
			const gameSnapshot = await db.ref('games/' + gameId).once('value');
			const gameData = gameSnapshot.val();
			return gameData;
		} catch (error) {
			console.error('Error getting game:', error);
			return null;
		}
	},
	update: async (gameId, newData) => {
		try {
			await db.ref('games/' + gameId).update(newData);
		} catch (error) {
			console.error('Error updating game:', error);
		}
	}
};

export {
	User,
	Game
};
