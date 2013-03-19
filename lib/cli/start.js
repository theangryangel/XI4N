'use strict';

require('js-yaml');

var manager = require('../protocols/manager'),
	semver = require('semver'),
	product = require('../product');

module.exports = function(target)
{
	console.log();
	console.log('  starting an instance of xi4n @ %s', target);
	console.log();

	process.chdir(target);

	var conf = require(path.join(target, 'config.yaml'));

	if (!semver.satisfies(product.version, conf.xi4n))
	{
		console.error();
		console.error('  configuration version mismatch!');
		console.error('  configuration states \'%s\'', conf.xi4n);
		console.error('  xi4n is version \'%s\'', product.version);
		console.error();

		process.exit(1);
	}

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
