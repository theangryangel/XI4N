var nconf = require('nconf'),
	client = require('./client'),
	logger = require('./logger');

// Setup nconf. Argv takes presedence over any local config.json
nconf.argv().file({ file: './config.json' });

var log = logger.create();

var c = new client.create(nconf.get('host'), nconf.get('port'), 'xi4n', log);

// Add our plugins
var pong = require('./pong');
c.addPlugin(pong);

// Connect
c.connect();
