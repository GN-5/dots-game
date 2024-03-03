const database = '';
let siteUrl, dbHost;

const dev = true;

if (dev) {
	siteUrl = 'http://localhost:3000';
	dbHost = database;
} else {
	siteUrl = 'heptadroid.com';
	dbHost = database;
}

module.exports = { siteUrl, dbHost };
