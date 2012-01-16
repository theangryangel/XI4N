"use strict";

var events = require('events'),
	path = require('path'),
	crypto = require('crypto'),
	util = require('util'),
	client = require('./client'),
	logger = require('./logger');

/**
 * ClientManager
 * Manages a collection of Clients
 */
var ClientManager = function(options, basepath)
{
	events.EventEmitter.call(this);

	var self = this;

	self.connected = 0;

	self.clients = {};
	self.basePath = basepath;

	self.logger = logger.create(options.logger);

	if (!options.clients)
		throw new Error('Missing clients key in options object');

	for (var i in options.clients)
	{
		// if the id is defined in the config, use that, otherwise generate an
		// Id
		var id = options.clients[i].id || self.generateId(options.clients[i]);

		self.clients[id] = client.create({
			"id": id,
			"name": options.clients[i].name,
			"host": options.clients[i].host,
			"port": options.clients[i].port,
			"maxbacklog": options.clients[i].maxbacklog,
		}, self.logger);

		// Client connection tracking for ClientManager
		self.clients[id].registerHook('connect', function()
		{
			self.connected++;
		});

		// Client connection tracking for ClientManager
		self.clients[id].registerHook('disconnect', function()
		{
			self.connected--;

			if (self.connected <= 0)
				self.emit('drain');
		});

		// add our plugins
		for (var j in options.clients[i].plugins)
			self.addPlugin(self.clients[id], options.clients[i].plugins[j]);
	}
}

util.inherits(ClientManager, events.EventEmitter);

ClientManager.prototype.generateId = function(pluginOpts)
{
	var sha1 = crypto.createHash('sha1');
	for(var i in pluginOpts)
		sha1.update(pluginOpts[i].toString());

	return sha1.digest('base64');
}

ClientManager.prototype.addPlugin = function(c, pluginOpts)
{
	var self = this;
	var plugin = null;

	if (path.existsSync(pluginOpts.path) || path.existsSync(pluginOpts.path + '.js'))
		plugin = require(pluginOpts.path); // absolute / already working path in our config object
	else if (path.existsSync(path.join(self.basePath, '/plugins/' + pluginOpts.path + '.js')))
		plugin = require(path.join(self.basePath, '/plugins/' + pluginOpts.path)); // Relative to basepath

	if (plugin != null)
		c.addPlugin(plugin, pluginOpts.options);
}

ClientManager.prototype.connect = function()
{
	var self = this;

	for(var i in self.clients)
		self.clients[i].connect();
}

ClientManager.prototype.disconnect = function()
{
	var self = this;

	for(var i in self.clients)
		self.clients[i].disconnect();
}

// exports
exports.create = function (options, basepath)
{
	return new ClientManager(options, basepath);
}
