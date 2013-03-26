"use strict";

var util = require('util'),
	events = require('events'),
	dgram = require('dgram');

var udp = function(port, host)
{
	events.EventEmitter.call(this);

	this.stream = null;
	this.host = host;
	this.port = port;
};

util.inherits(udp, events.EventEmitter);

udp.prototype.connect = function()
{
	var self = this;

	self.stream = dgram.createSocket('udp4');

	self.stream.on('listening', function(socket)
	{
		self.emit('connect', self);
	});

	self.stream.on('close', function(socket)
	{
		self.emit('disconnect', self);
	});

	self.stream.on('message', function(data, rinfo)
	{
		// emit straight up the tree - udp packets are whole and don't need
		// to be reformed
		self.emit('packet', data);
	});

	self.stream.on('error', function(err)
	{
		console.error('Udp error');
		console.error(err);
	});

	self.stream.bind(self.port);
}

udp.prototype.disconnect = function()
{
	this.stream.close();
}

udp.prototype.send = function(data)
{
	this.stream.send(data, 0, data.length, this.port, this.host);
}

module.exports = udp;
