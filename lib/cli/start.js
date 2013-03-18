'use strict';

require('js-yaml');

var manager = require('../protocols/manager');

module.exports = function(target)
{
	console.log();
	console.log('  starting an instance of xi4n @ %s', target);
	console.log();

	process.chdir(target);

	var conf = require(path.join(target, 'config.yaml'));

	var m = new manager(conf);

	m.on('drain', function()
	{
		process.exit(0);
	});

	if (process.platform != 'win32')
	{
		// quit on SIGINT gracefully
		// can't do this on Windows yet because of
		// https://github.com/joyent/node/issues/1553
		process.on('SIGINT', function()
		{
			m.stop();
		});
	}

	m.start();
}
