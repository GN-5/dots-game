const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { siteUrl } = require('./config');

const app = express();
app.use(cors({ origin: siteUrl }));

const serviceAccount = require('./serviceAccountKey.json'); // Firebase service account key file

// Initialize Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://dots-41c5f-default-rtdb.firebaseio.com'
});

// Define routes
app.get('/', (req, res) => {
	res.json({ message: 'server running...' });
});

app.post('/update-user/:id/:name/:oldId', (req, res) => {
	// Your logic for updating user
	res.sendStatus(200);
});

app.get('/game-list/:userId', async (req, res) => {
	try {
		const current = await Storage.getGameList(req.params.userId, false, 10);
		const finished = await Storage.getGameList(req.params.userId, true, 10);
		const name = await Storage.getUserName(req.params.userId);
		res.json({ name, current, finished });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Expose Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
