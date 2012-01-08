var clientmanager = require('./lib/clientmanager')
	fs = require('fs');

var opts = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var c = new clientmanager.create(opts, __dirname);

// Connect
c.connect();
