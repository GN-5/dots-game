const database = require('./firebase');
let siteUrl;

const dev = true;

if (dev) {
	siteUrl = 'http://localhost:3000';
} else {
	siteUrl = '';
}

module.exports = { siteUrl, database };