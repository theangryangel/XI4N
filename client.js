var util = require('util'), 
	events = require('events'), 
	net = require('net'), 
	BufferList = require('bufferlist').BufferList, 
	insim = require('./insim');

var Client = function(options, logger, name)
{
	events.EventEmitter.call(this);

	var self = this;

	self.options = options || {
		'host': '127.0.0.1',
		'port': 29999,
		'maxbacklog': 2048,
	};

	self.log = logger;
	self.name = 'xi4n';

	self.buffer = new BufferList;
	self.stream = null;

	// 'this' context that plugin functions are call
	self.ctx = { 'client': self, 'log': self.log };
};

util.inherits(Client, events.EventEmitter);

Client.prototype.connect = function()
{
	var self = this;

	self.stream = net.createConnection(self.options.port, self.options.host);

	// Connect
	self.stream.on('connect', function(socket)
	{
		var p = new insim.IS_ISI;
		p.iname = self.name;
		self.send(p);
	});

	// Data
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

	// Eror handling
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

Client.prototype.send = function(packet)
{
	var self = this;

	b = new Buffer(packet.pack());
	self.stream.write(b);

	delete b;
	delete packet;
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
			self.emit(pktName);
		}
		catch (err)
		{
			if (pktName == 'undefined')
				self.log.debug('unknown pkt - ' + pktId);
			self.log.debug(util.inspect(err));
		}

		// Next
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

Client.prototype.createPacket = function(name)
{
	var p = new insim[name];
	return p;
}

Client.prototype.registerHook = function(pktName, func)
{
	var self = this;

	self.on(pktName, function (data)
	{
		func.call(self.ctx);
	});
}

Client.prototype.addPlugin = function(plugin)
{
	var self = this;

	plugin.init.call(self.ctx);
}

exports.create = function (host, port, name, logger, maxbacklog)
{
	return new Client(host, port, name, logger, maxbacklog);
}
