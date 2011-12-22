var util = require('util'), 
	events = require('events'), 
	net = require('net'), 
	BufferList = require('bufferlist').BufferList, 
	insim = require('./insim');

var Plugin = function()
{
	this.client = null;
}

PingPlugin = function()
{
	Plugin.call(this);

	var self = this;

	console.log('client = ' + this.client);

	this.pong = function()
	{
		console.log('PONG');
		var p = new insim.IS_TINY;
		p.subt = insim.TINY_NONE;

		console.log(p);
	
		self.client.send(p);
	}

	//this.on('ISP_TINY', this.pong);
}

util.inherits(PingPlugin, Plugin);

Plugin.prototype.setClient = function(c)
{
	this.client = c;
	console.log(c);
}

var Client = function(host, port, name, maxbacklog, plugins)
{
	events.EventEmitter.call(this);

	var self = this;

	this.name = name;
	this.host = host;
	this.port = port;
	this.maxbacklog = maxbacklog || 2048;
	this.plugins = [];

	if (plugins)
	{
		this.plugins = plugins;

		for(var i = 0; i < this.plugins.length; i++)
		{
			this.plugins[i]._setupEvents.call(this.plugins[i], this);
		}
	}

	console.log(this.plugins);

	this.buffer = new BufferList;

	this.stream = null;
};

util.inherits(Client, events.EventEmitter);

Client.prototype.error = function(err)
{
	var self = this;
	console.log(err);
}

Client.prototype.connect = function()
{
	var self = this;

	self.stream = net.createConnection(self.port, self.host);

	// Connect
	self.stream.on('connect', function()
	{
		p = new insim.IS_ISI;
		p.iname = self.name;
		self.send(p);
	});

	// Data
	self.stream.on('data', function(self)
	{
		return function(data) {	self.receive.call(self, data); }
	}(self));

	// Eror handling
	self.stream.on('error', function(self)
	{
		return function(err) { self.error.call(self, err); }
	}(self)); 
}

Client.prototype.send = function(packet)
{
	var self = this;

	console.log('sending pkt ' + util.inspect(packet));

	b = new Buffer(packet.pack());
	self.stream.write(b);
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

			console.log(util.inspect(pkt));

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
	{
		throw new Error('Buffer is greater than the maximum permitted backlog. Dying.');
	}
}

Client.prototype.peekByte = function(offset)
{
	var self = this;

	offset = offset || 0;

	if (offset >= self.buffer.length)
		return 0;

	return self.buffer.take(1).readUInt8(offset);
}

var c = new Client('127.0.0.1', 29999, 'InodeSim');

var pingPlugin = new PingPlugin();
pingPlugin.setClient(c);
c.on('IS_TINY', function() {
	return function(data) { pingPlugin.pong.call(pingPlugin, data) }
}(pingPlugin));

c.on('IS_TINY', function() { console.log('got IS_TINY'); });
c.connect();
