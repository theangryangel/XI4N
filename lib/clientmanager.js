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

	self.plugins = {};

	self.logger = logger.create(options.logger);

	if (!options.clients)
		throw new Error('Missing clients key in options object');

	if (!options.plugins)
		throw new Error('Missing plugins key in options object');

	self.loadPlugins(options.plugins);

	self.loadClients(options.clients);
}

util.inherits(ClientManager, events.EventEmitter);

ClientManager.prototype.generateId = function(pluginOpts)
{
	var sha1 = crypto.createHash('sha1');
	for(var i in pluginOpts)
		sha1.update(pluginOpts[i].toString());

	return sha1.digest('base64');
}

ClientManager.prototype.loadPlugins = function(plugins)
{
	var self = this;

	for (var i in plugins)
	{
		if (self.plugins[i])
			continue; // plugin already loaded

		var plugin = null;

		if (path.existsSync(plugins[i].path) || path.existsSync(plugins[i].path + '.js'))
			plugin = require(plugins[i].path); // absolute / already working path in our config object
		else if (path.existsSync(path.join(self.basePath, '/plugins/' + plugins[i].path + '.js')))
			plugin = require(path.join(self.basePath, '/plugins/' + plugins[i].path)); // Relative to basepath

		if (plugin != null)
		{
			if (typeof plugin.construct == 'function')
				plugin.construct(plugins[i].options);

			self.plugins[i] = plugin;
		}
	}
}

ClientManager.prototype.associatePlugin = function(c, plugin)
{
	var self = this;

	if (!self.plugins[plugin])
		return; // no plugin by this name

	c.initPlugin(self.plugins[plugin]);
}

ClientManager.prototype.loadClients = function(clients)
{
	var self = this;

	for (var i in clients)
	{
		// if the id is defined in the config, use that, otherwise generate an
		// Id
		var id = clients[i].id || self.generateId(clients[i]);

		self.clients[id] = client.create({
			'id': id,
			'name': clients[i].name,
			'host': clients[i].host,
			'port': clients[i].port,
			'maxbacklog': clients[i].maxbacklog,
			'reconnect': clients[i].reconnect,
			'reconnectcooldown': clients[i].reconnectcooldown,
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

			// none of the clients are connected any more
			// we are drained
			if (self.connected <= 0)
				self.emit('drain');
		});

		// associate our plugins
		for (var j in clients[i].plugins)
			self.associatePlugin(self.clients[id], clients[i].plugins[j]);
	}
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
