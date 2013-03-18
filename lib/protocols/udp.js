"use strict";

var util = require('util'),
	events = require('events'),
	dgram = require('dgram');

var udp = function()
{
	events.EventEmitter.call(this);

	self.stream = null;
	self.host = null;
	self.port = null;
};

udp.prototype.connect = function(port, host)
{
	var self = this;
	self.host = host;
	self.port = port;

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

	self.stream.bind(port);
}

udp.prototype.disconnect = function()
{
	var self = this;
	self.stream.close();
}

udp.prototype.send = function(data)
{
	var self = this;
	self.stream.send(data, 0, data.length, self.port, self.host);
}

