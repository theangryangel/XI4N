"use strict";

var events = require('events'),
	path = require('path'),
	crypto = require('crypto'),
	util = require('util'),
	insim = require('./insim'),
	logger = require('./logger');

/**
 * ClientManager
 * Manages a collection of Clients
 */
var ClientManager = function(options, basepath)
{
	events.EventEmitter.call(this);

	var self = this;

	// properties
	self.connected = 0;
	self.rehashCount = 0;

	self.clients = {};
	self.basePath = basepath;

	self.plugins = {};

	self.logger = logger.create(options.logger);

	// methods
	self.connect = function()
	{
		for(var i in self.clients)
			self.clients[i].connect();
	};	

	self.disconnect = function()
	{
		for(var i in self.clients)
			self.clients[i].disconnect();
	};

	self.loadOptions = function(options)
	{
		if (self.rehashCount > 0)
			self.logger.info('*** rehashing *** ');

		self.rehashCount++;

		if (!options.clients)
			throw new Error('Missing clients key in options object');

		if (!options.plugins)
			throw new Error('Missing plugins key in options object');

		self.loadPlugins(options.plugins);

		self.loadClients(options.clients);
	};

	self.associatePlugin = function(c, plugin)
	{
		if (!self.plugins[plugin])
			return; // no plugin by this name

		c.initPlugin(self.plugins[plugin], plugin);
	};

	self.loadClients = function(clients)
	{
		for (var i in clients)
		{
			// if the id is defined in the config, use that, otherwise generate an
			// Id
			var id = clients[i].id || self.generateId(clients[i]);

			var opts = clients[i];

			if (!self.clients[id])
			{
				self.clients[id] = new insim.client({ 'id': id }, self.logger);

				// Client connection tracking for ClientManager
				self.clients[id].registerHook('connect', function()
				{
					self.connected++;
				});

				// Client connection tracking for ClientManager
				self.clients[id].registerHook('disconnect', function()
				{
					self.connected--;

					// none of the clients are connected any more
					// we are drained
					if (self.connected <= 0)
						self.emit('drain');
				});
			}

			self.clients[id].emit('options', opts);

			// associate our plugins
			for (var j in clients[i].plugins)
				self.associatePlugin(self.clients[id], clients[i].plugins[j]);
		}
	};

	self.loadPlugins = function(plugins)
	{
		console.log(plugins);
		for (var i in plugins)
		{
			if (self.plugins[i])
			{
				// plugin already loaded

				// If the client manager has been given new settings since the
				// plugin was loaded, attempt to sent it new options
				if ((self.plugins[i].rehashCount != self.rehashCount) && (typeof self.plugins[i].options == 'function'))
					self.plugins[i].options(plugins[i].options);

				self.plugins[i].rehashCount = self.rehashCount;

				// next
				continue; 
			}

			var plugin = null;

			if (path.existsSync(plugins[i].path) || path.existsSync(plugins[i].path + '.js'))
				plugin = require(plugins[i].path); // absolute / already working path in our config object
			else if (path.existsSync(path.join(self.basePath, '/plugins/', plugins[i].path)) || path.existsSync(path.join(self.basePath, '/plugins/' + plugins[i].path + '.js')))
				plugin = require(path.join(self.basePath, '/plugins/' + plugins[i].path)); // Relative to basepath

			if (plugin != null)
			{
				if (typeof plugin.construct == 'function')
					plugin.construct(plugins[i].options);

				plugin.rehashCount = self.rehashCount;

				self.plugins[i] = plugin;
			}
		}
	};

	// work
	if (options)
		self.loadOptions(options);
}

util.inherits(ClientManager, events.EventEmitter);

ClientManager.prototype.generateId = function(pluginOpts)
{
	var sha1 = crypto.createHash('sha1');
	for(var i in pluginOpts)
		sha1.update(pluginOpts[i].toString());

	return sha1.digest('base64');
}

// exports
exports.create = function (options, basepath)
{
	return new ClientManager(options, basepath);
}
