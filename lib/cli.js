"use strict";

/**
 * Module dependencies
 */
var util = require('util'),
	fs = require('fs'),
	fsutil = require('./fsutil'),
	path = require('path'),
	os = require('os'),
	sv = require('semver'),
	glob = require('glob').Glob,
	product = require('./product'),
	jsonTidy = require('./json-tidy'),
	clientmanager = require('./clientmanager'),
	basePKG = JSON.stringify({
		"name": product.name + "-" + product.version + "-custom", 
		"description": "A custom " + product.name + " install",	
		"version": "0.1"
	}),
	baseREADME = [
		"eXtensible Insim 4 Node(js)",
		"---------------------------",
		"Congratulations on creating a new set of default xi4n config files and plugins.",
		"",
		"This directory contains a few key files and directories.",
		"",
		" - config.json",
		"   This config for your client. You probably want to alter a few things in here",
		"   such as the hostname, passwords, plugins, etc.",
		" - plugins",
		"   This directory contains both base and custom plugins which you write to run",
		"   in xi4n.",
		"",
	].join(((os.platform() == 'win32') ? '\r\n' : '\n'));

/**
 * Returns the CLI wrapper, which parses and handles process argument inputs.
 *
 * Example:
 *     var c = new cli();
 *     c.execute();
 *
 * @class ClI wrapper
 * @return {Object} 
 * @api public
 */
var cli = function()
{
	var self = this;

	self.program = require('commander');
	self.program
		.version(product.version)
		.option('-i, --install <path>', 'Install basic config and standard plugins to <path>')
		.option('-c, --config <path>', 'Run xi4n install, using configuration at <path>')
		.option('-f, --force', 'Forces either install or config to run, if path already exists')
		.option('-s, --symlink', 'Used in conjunction with --install. Instead of copying, it creates a symlink to save space')
		.option('-u, --update <path>', 'Updates a given path with the newest plugins, --force assumed')
		.option('-W --watch', 'EXPERIMENTAL: Watches the configuration file, and attempts to hot-reload it, if it changes - very broken at present');
}

/**
 * Parses process arguments and executes the corresponding code
 *
 * @function
 * @api public
 */
cli.prototype.execute = function()
{
	self.program.parse(process.argv);

	if (self.program.install && self.program.config)
	{
		self.error('No support to run both install and config simultaneously. Surely you want to customise your config first?');
		process.exit(1);
	}

	if (self.program.update)
		self.update(function() { process.exit(0); });

	if (self.program.install)
		self.install(function() { process.exit(0); });

	if (self.program.config)
		self.run(function() { process.exit(0); });

	if (!self.program.install && !self.program.config)
	{
		process.stdout.write(self.program.helpInformation());
		process.exit(1);
	}
}

/**
 * Copies data and plugins from the global directory into the destination
 *
 * @function
 * @api private
 * @param {String} source
 * @param {String} destination
 * @param {Boolean} force Forces overwrite of destination, if files already exist
 * @param {Boolean} symlink Creates symlinks, rather than copying
 * @param {Function} next Callback to run next
 */
cli.prototype.deployDataAndPlugins = function(src, dst, force, symlink, next)
{
	var self = this;

	// copy node_modules
	self.log('Updating \''+ path.join(dst, 'node_modules') + '\'');
	if (fsutil.copydir(
		path.join(src, 'node_modules'), 
		path.join(dst, 'node_modules'),
		force,
		symlink
	) < 0)
		self.error('Failed');

	// copy base plugins
	self.log('Updating \''+ path.join(dst, 'plugins') + '\'');
	if (fsutil.copydir(
		path.join(src, 'plugins'), 
		path.join(dst, 'plugins'),
		force,
		symlink
	) < 0)
		self.error('Failed');

	// copy data
	self.log('Updating \'' + path.join(self.program.install, 'data') + '\'');
	if (fsutil.copydir(
		path.join(src, 'data'), 
		path.join(dst, 'data'),
		force,
		symlink
	) < 0)
		self.error('Failed');

	next();
}

/**
 * Installs (copies) from global into destination
 *
 * @function
 * @api private
 * @param {Function} next Callback to run next
 */
cli.prototype.install = function(next)
{
	var self = this;

	// performs install of config path
	self.program.install = path.resolve(self.program.install);

	var exists = path.existsSync(self.program.install);

	if (exists && !self.program.force)
	{
		self.warn('Forcing overwrite of existing files and directories');
		next();
	}

	if (!exists)
	{
		self.log('Creating destination directory');
		if (fsutil.mkdir(self.program.install) < 0)
			self.error('Failed');
	}

	// README
	self.log('Creating \'' + path.join(self.program.install, 'README') + '\'');
	if (fsutil.mkfile(
		path.join(self.program.install, 'README'), 
		baseREADME,
		self.program.force
	) < 0)
		self.error('Failed');

	// config.json
	self.log('Creating \'' + path.join(self.program.install, 'config.json') + '\'');
	if (fsutil.copyfile(
		path.join(product.basedir, 'config.json'), 
		path.join(self.program.install, 'config.json'),
		self.program.force
	) < 0)
		self.error('Failed');

	// plugins & data
	self.deployDataAndPlugins(product.basedir, self.program.install, self.program.force, self.program.symlink, next);
}

/**
 * Updates (copies) from global into destination
 *
 * @function
 * @api private
 * @param {Function} next Callback to run next
 */
cli.prototype.update = function(next)
{
	var self = this;

	// performs update of config path
	self.program.update = path.resolve(self.program.update);

	var exists = path.existsSync(self.program.update);

	if (!exists)
		self.program.invalidOptionValue('-u, --update <path>', 'Path does not exist! Cannot update.');

	self.deployDataAndPlugins(product.basedir, self.program.update, true, self.program.symlink, next);
}

/**
 * Watches a directory or file and calls a callback
 *
 * @function
 * @api private
 * @param {String} file Target to watch
 * @param {Function} next Callback to run next
 */
cli.prototype.watch = function(file, next)
{
	var self = this;

	fs.watch(file, { persistent: true }, function (event, filename)
	{
		if (event == 'change')
		{
			setTimeout(function()
			{
				next();
			}, 500);
		}
	});
}

/**
 * Loads a configuration file
 *
 * @function
 * @api private
 * @param {String} configFile
 */
cli.prototype.load = function(configFile)
{
	var self = this;

	// parse our config file
	// it's user-editable, so we cannot be 100% sure that it's valid JSON,
	// so lets do some basic tidying on it first, removing some common mistakes
	var opts = jsonTidy.tidyParseFile(configFile, 'utf8');

	// check out config file supports this version of xi4n
	if ((!opts.xi4n) || (!sv.satisfies(product.version, opts.xi4n)))
	{
		self.error('Mis-matched versions, config expects \'' + opts.xi4n + '\', xi4n is \'' + product.version + '\'');
		return;
	}

	return opts;
}

/**
 * Merges 2 objects together
 *
 * @function
 * @api private
 * @param {Object} obj1 
 * @param {Object} obj2
 */
cli.prototype.merge = function(obj1, obj2)
{
	// recursively merge 2 objects
	for (var i in obj2)
	{
		try
		{
			if (typeof obj2[i] == 'object')
				obj1[i] = self.merge(obj1[i], obj2[i]);
			else
				obj1[i] = obj2[i];
		}
		catch(e)
		{
			obj1[i] = obj2[i];
		}
	}

	return obj1;
}

/**
 * Reads and parses configuration, creates a corresponding clientmanager and
 * handles reconnections.
 *
 * @function
 * @api private
 * @param {Function} next Callback to run after all connections have been lost
 * or closed
 */
cli.prototype.run = function(next)
{
	var self = this;

	self.program.config = path.resolve(self.program.config);
	// resolve, so we can do things like "xi4n -c ."
	if (!path.existsSync(self.program.config))
		self.program.invalidOptionValue('-c, --config <path>', 'path does not exist');

	var configFile = path.join(self.program.config, 'config.json');

	if (!path.existsSync(configFile))
		self.program.invalidOptionValue('-c, --config <path>', 'path exists, but cannot find config.json');

	self.log('Running with given path \'' + self.program.config + '\'');

	var opts = self.load(configFile);

	// handle config.d
	var configD = path.join(self.program.config, 'config.d');

	if (path.existsSync(configD))
	{
		var files = new glob('*.json', {
			cwd: configD,
			sync: true
		});

		for (var f in files.found)
			opts = self.merge(opts, self.load(path.join(configD, files.found[f])));
	}

	if (!opts)
	{
		self.error('Failed to load configuration file!');
		next();
	}

	// setup clientmanager
	var c = new clientmanager.create(opts, self.program.config);

	if (self.program.watch)
	{
		self.warn('EXPERIMENTAL watch feature enabled. Here be Dragons.');

		// watch the config file, if it changes, reload and sent the config down
		// the tree
		self.watch(configFile, function()
		{
			c.loadOptions(self.load(configFile));
		});
	}

	c.on('drain', function()
	{
		self.log('Lost all InSim connections, quitting');
		next();
	});

	// connect
	c.connect();

	if (process.platform != 'win32')
	{
		// quit on SIGINT gracefully
		// can't do this on Windows yet because of 
		// https://github.com/joyent/node/issues/1553
		process.on('SIGINT', function()
		{
			self.log('Got SIGINT, disconnecting gracefully');
			c.disconnect();
			next();
		});
	}
};

/**
 * Log a string to stdout
 *
 * @function
 * @api private
 * @param {String} payload
 */
cli.prototype.log = function(payload)
{
	console.log("    %s", payload);
}

/**
 * Log a string to stderr
 *
 * @function
 * @api private
 * @param {String} payload
 */
cli.prototype.warn = function(payload)
{
	console.warn("    %s", payload);
}

/**
 * Log a string to stderr
 *
 * @function
 * @api private
 * @param {String} payload
 */
cli.prototype.error = function(payload)
{
	console.error("    %s", payload);
}

/**
 * Creates and returns an instance of cli
 *
 * @function
 * @api public
 * @return {Object}
 */
exports.create = function()
{
	return new cli;
}
