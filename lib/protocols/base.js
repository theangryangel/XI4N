'use strict';

var util = require('util'),
	events = require('events'),
	product = require('../product'),
	_ = require('underscore'),
	uuid = require('node-uuid');

var devnull = {
	'log': function() {},
	'warn': function() {},
	'error': function() {}
};

var client = function(options, log)
{
	events.EventEmitter.call(this);

	this.defaults = {
	};

	this.product = product;
	this.decoders = [];
	this.log = log || devnull;

	this.options = _.defaults(options, this.defaults);

	if (!this.options.id)
		this.id = uuid.v4()
}

util.inherits(client, events.EventEmitter);

client.prototype.associate = function(plugin)
{
	plugin.associate(this);
}

client.prototype.connect = function()
{
	throw new Error('connect must be implemented!');
}

client.prototype.disconnect = function()
{
	throw new Error('disconnect must be implemented!');
}

client.prototype.off = function(e, cb)
{
	this.removeListener(e, cb);
}

client.prototype.receive = function(data)
{
	for(var i in this.decoders)
	{
		var decoder = this.decoders[i];
		var packet = decoder.decode(data);
		if (packet == null)
			continue;

		var name = decoder.getName(packet.type);
		this.emit(name, packet);

		this.log.debug('Received ' + name);
		//this.log.debug(util.inspect(packet, { depth: null }));

		return;
	}

	this.log.warn('Unknown packet' + data);
}

client.prototype.send = function(packet)
{
	throw new Error('send must be implemented!');
}

module.exports = client;
