var util = require('util'), 
	events = require('events'), 
	net = require('net'), 
	BufferList = require('bufferlist').BufferList, 
	insim = require('./insim');

var Client = function(host, port, name, maxbacklog)
{
	events.EventEmitter.call(this);

	var self = this;

	this.name = name;
	this.host = host;
	this.port = port;
	this.maxbacklog = maxbacklog || 2048;

	this.buffer = new BufferList;
	this.stream = null;
};

util.inherits(Client, events.EventEmitter);

Client.prototype.connect = function()
{
	var self = this;

	self.stream = net.createConnection(self.port, self.host);

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
		console.log('Disconnected');

		if (err)
			console.log('Server disappeared');
	});

	// Eror handling
	self.stream.on('error', self.error);

	self.stream.on('timeout', self.error);
}

Client.prototype.disconnect = function()
{
	var self = this;

	var p = new insim.IS_TINY;
	p.subt = insim.TINY_CLOSE;
	self.send(p);

	self.stream.end();
}

Client.prototype.error = function(err)
{
	console.log(err);
}

Client.prototype.timeout = function()
{
	console.log('Timeout occured');
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

		console.log('buffer now ' + self.buffer.length);

		var pktId = p.readUInt8(1);

		var pktName = insim.translatePktIdToName(pktId);
		console.log('consumed packet ' + pktName + ' @ size ' + size);

		try
		{
			var pkt = new insim[pktName];
			pkt.unpack(p);

			console.log('emitting pkt ' + pktName);
			self.emit(pktName);
		}
		catch (err)
		{
			if (pktName == 'undefined')
				console.log('unknown pkt - ' + pktId);
			console.log(util.inspect(err));
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
		func.call({ client: self });
	});
}

Client.prototype.addPlugin = function(plugin)
{
	var self = this;

	plugin.init.call({ client: self });
}

exports.Client = Client;
