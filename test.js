var nconf = require('nconf'),
	Client = require('./client').Client;

// Setup nconf. Argv takes presedence over any local config.json
nconf.argv().file({ file: './config.json' });

var c = new Client(nconf.get('host'), nconf.get('port'), 'xi4n');

// Add our plugins
var pong = require('./pong');
c.addPlugin(pong);

// Connect
c.connect();
