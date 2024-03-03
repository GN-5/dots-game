const { firebaseAdmin } = require('./firebase');

// Define User schema and model
const User = {
	create: async (userData) => {
		try {
			await firebaseAdmin.collection('users').doc(userData.id).set(userData);
		} catch (error) {
			console.error('Error creating user:', error);
		}
	},
	get: async (userId) => {
		try {
			const userDoc = await firebaseAdmin.collection('users').doc(userId).get();
			if (userDoc.exists) {
				return userDoc.data();
			} else {
				return null;
			}
		} catch (error) {
			console.error('Error getting user:', error);
			return null;
		}
	},
	update: async (userId, newData) => {
		try {
			await firebaseAdmin.collection('users').doc(userId).set(newData, { merge: true });
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}
};

// Define Game schema and model
const Game = {
	create: async (gameData) => {
		try {
			await firebaseAdmin.collection('games').doc(gameData.gameId).set(gameData);
		} catch (error) {
			console.error('Error creating game:', error);
		}
	},
	get: async (gameId) => {
		try {
			const gameDoc = await firebaseAdmin.collection('games').doc(gameId).get();
			if (gameDoc.exists) {
				return gameDoc.data();
			} else {
				return null;
			}
		} catch (error) {
			console.error('Error getting game:', error);
			return null;
		}
	},
	update: async (gameId, newData) => {
		try {
			await firebaseAdmin.collection('games').doc(gameId).set(newData, { merge: true });
		} catch (error) {
			console.error('Error updating game:', error);
		}
	}
};

module.exports = {
	User,
	Game
};
