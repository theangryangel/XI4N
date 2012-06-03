"use strict";

/**
 * Module dependencies
 */
var util = require('util'), 
	events = require('events'), 
	logger = require('./logger'),
	product = require('./product');

/**
 * Abstract packet class. It should not be used by itself, without extending it.
 *
 * @class pkt
 * @api private
 */
exports.pkt = function()
{
	var self = this;

	/**
	 * Pack and unpack functions use this variable to determine how to pack and
	 * unpack data to and from LFS. This string must match the format specified
	 * by jspack.
	 *
	 * @api private
	 */
	this._PACK = '<';

	this.size = 0;
	this.type = exports.ISP_NONE;
}

/**
 * Returns the "public" properties, that are not functions. 
 * "Public" properties are defined as anything that's not a function and
 * anything that is not prefixed with an underscore.
 *
 * @api private
 */
exports.pkt.prototype.getProperties = function(values)
{
	var properties = [];
	for(var propertyName in this)
	{
		if (typeof this[propertyName] == 'function')
			continue;

		var c = propertyName.charAt(0);
		if (c == '_')
			continue;

		properties.push(propertyName);
	}

	return properties;
}

/**
 * Packs member properties into a buffer, using jspack, ready to be sent to LFS
 *
 * @api public
 */
exports.pkt.prototype.pack = function(values)
{
	var properties = this.getProperties();
	var values = [];
	for (var i = 0; i < properties.length; i++)
		values.push(this[properties[i]]);

	return jspack.Pack(this._PACK, values);
}

/**
 * Unpacks a buffer, from LFS, into the packet object. It attempts to
 * automatically convert several data types into more JavaScript friendly
 * forms - such as strings into utf8, instead of LFS' codepages.
 *
 * @api public
 */
exports.pkt.prototype.unpack = function(buf)
{
	var self = this;

	var data = jspack.Unpack(self._PACK, buf, 0);

	var properties = this.getProperties();
	for (var i = 0; i < properties.length; i++)
	{
		var t = data[i];

		// automatically deal with null terminated strings sanely and convert to
		// utf8
		if ((typeof data[i] == 'string') && (data[i].length > 0))
		{
			t = self.getNullTermdStr(t);

			// XXX: if over 4 characters in length it's probably a real string
			// that we want in utf8, such as chat or player name
			if (data[i].length >= 4)
				t = sillystring.toUTF8(t);
		}

		self[properties[i]] = t;
	}
}

/**
 * Returns a string, without the null termination.
 *
 * @api public
 */
exports.pkt.prototype.getNullTermdStr = function(str)
{
	// deal with null terminated string
	var idx = str.indexOf('\0');
	if (idx < 0)
		return str;

	return str.substr(0, idx);
}

/**
 * Abstract Client - All other instances derive from this, such as InSim,
 * Outgauge and Outsim. Along this class is not useful.
 *
 * @api public
 * @param {Object} options Configuration
 * @param {Object} [log] Logger instance, if not provided it's generated for you
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

/**
 * Sets the associated client options. If not provided some base settings are
 * created and set.
 *
 * @api public
 * @param {Object} [options] Configuration
 */
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

/**
 * emit
 *
 * Emits an event to the event subscribers.
 *
 * Overwrite the standard eventemitter.emit with our own
 * this is the easiest way I can see of how to call with our own scope context
 * and still permit us to easily remove a listener at a later date (closures
 * causes issues with this, naturally :-/)
 * this is basically almost a straight copy of the original emit
 * 
 * @api public
 * @param {Object} [options] Configuration
 */
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

/**
 * Connects to LFS using the given protocol. This MUST be provided by the
 * relevant subclass.
 *
 * @api public
 * @return {null}
 */
Client.prototype.connect = function()
{
	return;
}

/**
 * Disconnects from LFS. This MUST be provided by the relevant subclass.
 *
 * @api public
 * @return {null}
 */
Client.prototype.disconnect = function()
{
	return;
}

/**
 * Sends a packet to LFS. This MUST be provided by the relevant subclass.
 *
 * @api public
 * @return {null}
 */
Client.prototype.send = function(pkt)
{
	return;
}

/**
 * Receives and parses packets from LFS. This MUST be provided by the relevant subclass.
 *
 * @api public
 * @return {null}
 */
Client.prototype.receive = function(data)
{
	return;
}

/**
 * A useful, but deprecated, alias for .on
 *
 * @api public
 * @deprecated
 * @return {null}
 */
Client.prototype.registerHook = function(pktName, func)
{
	var self = this;

	self.on(pktName, func);
}

/**
 * A complementing, but deprecated, function for .registerHook
 *
 * @api public
 * @deprecated
 * @return {null}
 */
Client.prototype.unregisterHook = function(pktName, func)
{
	var self = this;

	self.removeListener(pktName, func);
}

/**
 * A better alias for .removeListener.
 *
 * @param {String} pktName Packet to remove function from
 * @param {Function} func Function to remove
 * @api public
 * @return {null}
 */
Client.prototype.off = function(pktName, func)
{
	var self = this;

	self.removeListener(pktName, func);
}

/**
 * Attachs a plugin instance to this client instance.
 *
 * @api public
 * @param {Object} plugin Plugin instance
 * @param {String} name Plugin name
 * @return {null}
 */
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

/**
 * Exports the client
 *
 * @api public
 */
exports.client = Client;
