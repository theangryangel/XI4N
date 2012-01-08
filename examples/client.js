/*
 * Simple example of how to use the client class
 * Unless you're planning on using xi4n as a library, you won't care about this
 */

var client = require('../lib/client');

var opts = {
	'id': 0, // ClientManager will auto-generate an ID for you, if not provided, however Client will not
	'name': 'default', // Friendly name, for your (debugging) reference
	'host': '127.0.0.1', // Host to connect to
	'port': 29999, // Port
	'maxbacklog': 2048 // Max backlog of bytes in the buffer, before we give up. 2048 should be plenty.
}

// Note we don't bother setting any flags. The plugins should take care of that
// themselves

var c = new client.create(opts);

// Add our plugins
var pong = require('../plugins/pong');
c.addPlugin(pong);

//var mci = require('./plugins/mci');
//c.addPlugin(mci);

// Connect
c.connect();
