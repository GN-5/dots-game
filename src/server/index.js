const functions = require('firebase-functions');
const express = require('express');
const Storage = require('./Storage');
const { siteUrl } = require('./config');

const app = express();

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', siteUrl);

	// Request methods you wish to allow
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);

	// Request headers you wish to allow
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With,content-type'
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

app.get('/', function (req, res) {
	res.json({ message: 'server running...' });
});

app.post('/update-user/:id/:name/:oldId', function (req, res) {
	Storage.updateUser(req.params);
	res.sendStatus(200);
});


app.get('/game-list/:userId', async function (req, res) {
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
