var nconf = require('nconf'),
	client = require('./lib/client');

// Setup nconf. Argv takes presedence over any local config.json
nconf.argv().file({ file: './config.json' });

var opts = {
	'host': nconf.get('host'), 
	'port': nconf.get('port'),
	'maxbacklog': nconf.get('maxbacklog')
}

var c = new client.create(opts);

// Add our plugins
var pong = require('./plugins/pong');
c.addPlugin(pong);

//var mci = require('./plugins/mci');
//c.addPlugin(mci);

// Connect
c.connect();
