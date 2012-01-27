"use strict";

var util = require('util'), 
	events = require('events'), 
	net = require('net'), 
	BufferList = require('bufferlist').BufferList, 
	insim = require('./insim'),
	logger = require('./logger'),
	product = require('./product');

/**
 * Client
 * Probably better considered as an InSim Connection
 */
var Client = function(options, log)
{
	events.EventEmitter.call(this);

	var self = this;

	self.options = options || {
		'name': 'default-localhost',
		'host': '127.0.0.1',
		'port': 29999,
		'maxbacklog': 2048,
		'reconnect': 0,
		'reconnectcooldown': 30
	};

	self.id = options.id || '';

	self.log = log || logger.create();
	self.name = product.full;

	self.buffer = new BufferList;
	self.stream = null;

	self.plugins = [];

	// should be set by plugins automagically
	// when the plugin init function is called
	self.isiFlags = 0;

	self.isHost = '';
	self.hostname = '';

	self.reconnectAttempts = 0;

	// 'this' context that plugin functions are call
	self.ctx = { 'client': self, 'log': self.log, 'insim': insim, 'product': product };

	//self.registerHook('IS_ISM', self.onIS_ISM);
	self.registerHook('IS_VER', self.onIS_VER);

	// deal with reconnections
	self.on('preconnect', function()
	{
		self.reconnectAttempts++;
	});

	// we're connected, reset our attempt counter
	self.on('connect', function()
	{
		self.reconnectAttempts = 0;
	});
};

util.inherits(Client, events.EventEmitter);

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
	var self = this;

	self.emit('preconnect');

	self.stream = net.createConnection(self.options.port, self.options.host);

	// connect
	self.stream.on('connect', function(socket)
	{
		var p = new insim.IS_ISI;
		p.iname = self.name;
		p.flags = self.isiFlags;
		p.interval = 1000;
		p.reqi = 1; // request the InSim version from host

		self.send(p);
	});

	// data
	self.stream.on('data', function(data)
	{
		self.receive.call(self, data);
	});

	self.stream.on('close', function(err)
	{
		self.log.info('Disconnected');

		if ((self.options.reconnect > 0) && (self.reconnectAttempts <= self.options.reconnect))
		{
			// reconnection logic
			var cooldown = (self.reconnectAttempts * self.options.reconnectcooldown);

			self.log.info('Lost connection, attempting reconnect (' + self.reconnectAttempts + ') in ' + cooldown + ' seconds');

			setTimeout(function() { self.connect.call(self); }, (cooldown * 1000));
			return;
		}

		// disconnect only gets emitted after all reconnection attempts have
		// been made
		// really disconnect should be thought of as a terminating event
		self.emit('disconnect');

		if (err)
			self.log.info('Server disappeared');
	});

	// error handling
	self.stream.on('error', function(err)
	{
		self.log.crit(err);
	});

	self.stream.on('timeout', function()
	{
		self.log.crit('Timeout occured');
	});
}

Client.prototype.disconnect = function()
{
	var self = this;

	var p = new insim.IS_TINY;
	p.subt = insim.TINY_CLOSE;
	self.send(p);

	self.stream.end();
}

Client.prototype.send = function(pkt)
{
	var self = this;

	var b = new Buffer(pkt.pack());
	self.stream.write(b);

	b = null;
	pkt = null; // should be the last point we care about the packet. but do we want to assume this?
}

Client.prototype.receive = function(data)
{
	var self = this;

	this.buffer.push(data);

	var pos = 0;
	var size = self.peekByte();

	while ((self.buffer.length > 0) && (size <= self.buffer.length))
	{
		var p = self.buffer.take(size);
		self.buffer.advance(size);

		self.log.debug('buffer now ' + self.buffer.length);

		var pktId = p.readUInt8(1);
		var pktName = insim.translatePktIdToName(pktId);
		self.log.debug('consumed packet ' + pktName + ' @ size ' + size);

		try
		{
			var pkt = new insim[pktName];
			pkt.unpack(p);

			self.log.debug('emitting pkt ' + pktName);
			self.emit(pktName, pkt);
		}
		catch (err)
		{
			if (pktName == 'undefined')
				self.log.crit('unknown pkt - ' + pktId);
			self.log.crit('Error');
			self.log.crit(err.stack);
			self.log.crit(util.inspect(err));
		}

		// next packet size
		size = self.peekByte();
	}

	if (self.buffer.length > self.maxbacklog)
		throw new Error('Buffer is greater than the maximum permitted backlog. Dying.');
}

Client.prototype.peekByte = function(offset)
{
	var self = this;

	offset = offset || 0;

	if (offset >= self.buffer.length)
		return 0;

	return self.buffer.take(1).readUInt8(offset);
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

Client.prototype.initPlugin = function(plugin, opts)
{
	var self = this;

	// init and term only get called ONCE

	// init your plugin
	// any setup can be called here
	plugin.init.call(self.ctx, opts);

	// wire up the termination hook automagically
	// any tear down should be done here
	if (typeof plugin.term == 'function')
		self.on('disconnect', plugin.term);
}

// essential version and state handling
Client.prototype.onIS_VER = function(pkt)
{
	var self = this;

	if (pkt.insimver != this.insim.VERSION)
		this.log.crit("Reported InSim Version from LFS does not match our library supported version. May result in undesirable behaviour!");

	this.client.emit('connect');
}

Client.prototype.onIS_ISM = function(pkt)
{
	console.log('HANDLED ISM');

	self.isHost = pkt.host;
	self.hostname = pkt.hname;
	console.log('Is Host ' + self.isHost + ' on ' + self.hostname);
}

// exports
exports.create = function (host, port, name, logger, maxbacklog)
{
	return new Client(host, port, name, logger, maxbacklog);
}
