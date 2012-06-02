"use strict";

var util = require('util'), 
	events = require('events'), 
	logger = require('./logger'),
	product = require('./product');

/**
 * Base Client
 * Probably better considered as an Connection
 */
var Client = function(options, log)
{
	events.EventEmitter.call(this);

	var self = this;

	self.setOptions(options);

	self.id = self.options.id || '';

	self.log = log || logger.create();
	self.name = product.full;

	self.stream = null;

	self.plugins = [];

	self.reconnectAttempts = 0;

	// 'this' context that plugin functions are call
	self.ctx = { 'client': self, 'log': self.log, 'product': product };

	self.on('options', function(options)
	{
		// new options
		self.setOptions(options);
	});

	// deal with reconnections
	self.on('preconnect', function()
	{
		self.reconnectAttempts++;
	});

	// we're connected, reset our attempt counter
	self.on('connect', function()
	{
		self.log.info('Connected');

		self.reconnectAttempts = 0;
	});
};

util.inherits(Client, events.EventEmitter);

Client.prototype.setOptions = function(options)
{
	this.options = options || {
		'id': 0,
		'name': 'default-localhost',
		'host': '127.0.0.1',
		'port': 29999,
		'maxbacklog': 2048,
		'reconnect': 0,
		'reconnectcooldown': 30
	};
}

// overwrite the standard eventemitter.emit with our own
// this is the easiest way I can see of how to call with our own scope context
// and still permit us to easily remove a listener at a later date (closures
// causes issues with this, naturally :-/)
// this is basically almost a straight copy of the original emit
Client.prototype.emit = function()
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
				handler.call(self.ctx);
				break;
			case 2:
				handler.call(self.ctx, arguments[1]);
				break;
			case 3:
				handler.call(self.ctx, arguments[1], arguments[2]);
				break;
				// slower
			default:
				var l = arguments.length;
				var args = new Array(l - 1);
				for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
				handler.apply(self.ctx, args);
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
			listeners[i].apply(self.ctx, args);

		return true;
	}

	return false;
}

Client.prototype.connect = function()
{
	return;
}

Client.prototype.disconnect = function()
{
	return;
}

Client.prototype.send = function(pkt)
{
	return;
}

Client.prototype.receive = function(data)
{
	return;
}

// now just here as an alias for on, and for legacy purposes
Client.prototype.registerHook = function(pktName, func)
{
	var self = this;

	self.on(pktName, func);
}

// a compariable language for removing a hook
Client.prototype.unregisterHook = function(pktName, func)
{
	var self = this;

	self.removeListener(pktName, func);
}

// a better alias for removeListener/unregisterHook
Client.prototype.off = function(pktName, func)
{
	var self = this;

	self.removeListener(pktName, func);
}

Client.prototype.initPlugin = function(plugin, name)
{
	var self = this;

	// Have we already got this plugin?
	if (!self.plugins[name])
	{
		self.plugins[name] = true;

		// init and term only get called ONCE

		// init your plugin
		// any setup can be called here
		plugin.init.call(self.ctx);

		// wire up the termination hook automagically
		// any tear down should be done here
		if (typeof plugin.term == 'function')
			self.on('disconnect', plugin.term);
	}
}

exports.client = Client;

// exports
exports.create = function (opts, logger)
{
	return new Client(opts, logger);
}
