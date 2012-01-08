/*
 * Simple example of how to use the ClientManager class
 * Unless you're planning on using xi4n as a library, you won't care about this
 */

var clientmanager = require('../lib/clientmanager')
	fs = require('fs');

var opts = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

// Create our ClientManager instance
var c = new clientmanager.create(opts, __dirname);

// Connect all configured client's
c.connect();

// Gracefully disconnects
// c.disconnect();
