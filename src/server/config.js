const database = require('./firebase');
let siteUrl;

const dev = true;

if (dev) {
	siteUrl = 'http://localhost:3000';
} else {
	siteUrl = 'https://gn-5.github.io/dots-game/';
}

module.exports = { siteUrl, database };