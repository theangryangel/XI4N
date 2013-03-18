"use strict";

var events = require('events'),
	product = require('../product');

var devnull = {
	'log': function() {},
	'warn': function() {},
	'error': function() {}
};

var client = function(options, log)
{
	events.EventEmitter.call(this);

	this.product = product;
	this.decoders = [];
	this.log = log || devnull;
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
		if (p == null)
			continue;

		var name = decoder.getName(packet.type);
		console.log("got packet %s", name);
		console.log(util.inspect(p));
		this.emit(name, packet);
		return;
	}
}

client.prototype.send = function(packet)
{
	throw new Error('send must be implemented!');
}

client.prototype.emit = function()
{
	var self = this;

	var type = arguments[0];
	// If there is no 'error' event listener then throw.
	if (type === 'error')
	{
		if (!this._events || !this._events.error ||
			(Array.isArray(this._events.error) && !this._events.error.length))
		{
			if (arguments[1] instanceof Error)
				throw arguments[1]; // Unhandled 'error' event
			else
				throw new Error("Uncaught, unspecified 'error' event.");
		}
	}

	if (!this._events)
		return false;

	var handler = this._events[type];

	if (!handler)
		return false;

	if (typeof handler == 'function')
	{
		switch (arguments.length)
		{
			// fast cases
			case 1:
				handler.call(self);
				break;
			case 2:
				handler.call(self, arguments[1]);
				break;
			case 3:
				handler.call(self, arguments[1], arguments[2]);
				break;
			// slower
			default:
				var l = arguments.length;
				var args = new Array(l - 1);
				for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
				handler.apply(self, args);
		}

		return true;
	}
	else if (Array.isArray(handler))
	{
		var l = arguments.length;
		var args = new Array(l - 1);
		for (var i = 1; i < l; i++)
			args[i - 1] = arguments[i];

		var listeners = handler.slice();
		for (var i = 0, l = listeners.length; i < l; i++)
			listeners[i].apply(self, args);

		return true;
	}

	return false;
}

module.exports = client;
