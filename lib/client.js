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
	};

	self.id = options.id || '';

	self.log = log || logger.create();
	self.name = product.full;

	self.buffer = new BufferList;
	self.stream = null;

	// should be set by plugins automagically
	// when the plugin init function is called
	self.isiFlags = 0;

	self.isHost = '';
	self.hostname = '';

	// 'this' context that plugin functions are call
	self.ctx = { 'client': self, 'log': self.log, 'insim': insim };

	//self.registerHook('IS_ISM', self.onIS_ISM);
	self.registerHook('IS_VER', self.onIS_VER);
};

util.inherits(Client, events.EventEmitter);

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
				self.log.debug('unknown pkt - ' + pktId);
			self.log.debug('Error');
			self.log.debug(err.stack);
			self.log.debug(util.inspect(err));
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

Client.prototype.registerHook = function(pktName, func)
{
	var self = this;

	self.on(pktName, function (data)
	{
		func.call(self.ctx, data);
	});
}

Client.prototype.addPlugin = function(plugin, opts)
{
	var self = this;

	plugin.init.call(self.ctx, opts);
}

// essential version and state handling
Client.prototype.onIS_VER = function(pkt)
{
	if (pkt.insimver != this.insim.VERSION)
		this.log.crit("Reported InSim Version from LFS does not match our library supported version. May result in undesirable behaviour!");
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
