var path = require('path'),
	crypto = require('crypto'),
	util = require('util'),
	client = require('./client');

/**
 * ClientManager
 * Manages a collection of Clients
 */
var ClientManager = function(options, basepath)
{
	var self = this;

	self.clients = {};
	self.basePath = basepath;

	if (!options.clients)
		throw new Error('Missing clients key in options object');

	for (var i in options.clients)
	{
		console.log(util.inspect(options.clients[i]));

		var id = options.clients[i].id || self.generateId(options.clients[i]);

		self.clients[id] = client.create({
			"id": id,
			"name": options.clients[i].name,
			"host": options.clients[i].host,
			"port": options.clients[i].port,
			"maxbacklog": options.clients[i].maxbacklog,
		});

		for (j in options.clients[i].plugins)
			self.addPlugin(self.clients[id], options.clients[i].plugins[j]);
	}
}

ClientManager.prototype.generateId = function(pluginOpts)
{
	var sha1 = crypto.createHash('sha1');
	for(i in pluginOpts)
		sha1.update(pluginOpts[i].toString());

	return sha1.digest('base64');
}

ClientManager.prototype.addPlugin = function(c, pluginOpts)
{
	var self = this;
	var plugin = null;

	if (path.existsSync(pluginOpts.path))
		plugin = require(pluginOpts.path); // Absolute path
	else if (path.existsSync(path.join(self.basePath, '/plugins/' + pluginOpts.path + '.js')))
		plugin = require(path.join(self.basePath, '/plugins/' + pluginOpts.path + '.js')); // Relative to basepath

	if (plugin != null)
		c.addPlugin(plugin);
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
