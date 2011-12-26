var nconf = require('nconf'),
	client = require('./client'),
	logger = require('./logger');

// Setup nconf. Argv takes presedence over any local config.json
nconf.argv().file({ file: './config.json' });

var log = logger.create();

var opts = {
	'host': nconf.get('host'), 
	'port': nconf.get('port'),
	'maxbacklog': nconf.get('maxbacklog')
}

var c = new client.create(opts, log);

// Add our plugins
var pong = require('./pong');
c.addPlugin(pong);

// Connect
c.connect();
