"use strict";

var util = require('util'),
	events = require('events'),
	net = require('net'),
	BufferList = require('bufferlist').BufferList;

var tcp = function(port, host)
{
	events.EventEmitter.call(this);

	this.host = host;
	this.port = port;

	this.stream = null;
	this.buffer = new BufferList;
};

util.inherits(tcp, events.EventEmitter);

tcp.prototype.connect = function()
{
	var self = this;

	self.stream = net.connect(this.port, this.host);

	self.stream.on('connect', function(socket)
	{
		self.emit('connect', self);
	});

	self.stream.on('close', function(socket)
	{
		self.emit('disconnect', self);
	});

	// data
	self.stream.on('data', function(data)
	{
		self.receive.call(self, data);
	});

	self.stream.on('error', function(data)
	{
		console.log('TCP error');
		console.log(data);
	});
}

tcp.prototype.receive = function(data)
{
	var self = this;

	this.buffer.push(data);

	var pos = 0;
	var size = self.peekByte();

	while ((self.buffer.length > 0) && (size <= self.buffer.length))
	{
		var p = self.buffer.take(size);
		self.emit('packet', p);

		self.buffer.advance(size);

		// next packet size
		size = self.peekByte();
	}

	if (self.buffer.length > self.maxbacklog)
		throw new Error('Buffer is greater than the maximum permitted backlog. Dying.');
}

tcp.prototype.peekByte = function(offset)
{
	offset = offset || 0;

	if (offset >= this.buffer.length)
		return 0;

	return this.buffer.take(1).readUInt8(offset);
}

tcp.prototype.send = function(data)
{
	this.stream.write(data);
}

tcp.prototype.disconnect = function()
{
	this.stream.end();
}

module.exports = tcp;
