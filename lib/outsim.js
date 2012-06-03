"use strict";

(function(exports)
{

/**
 * Module dependencies
 */
var util = require('util')
	baseClient = require('./client');

// Translating LFS insim.h to jspack as follows -
// char	= c
// byte	= B
// word	= H
// short = h
// unsigned	= L
// int = l
// float = f
// char[16] = 16s

exports.OS_PACK = function()
{
	this._PACK = '<Lffffffffffffllll';

	this.time = 0; // time in milliseconds (to check order)

	// TODO - Proper Vector object
	this.angvelx = 0;
	this.angvely = 0;
	this.angvelz = 0;

	this.heading = 0; // anticlockwise from above (z)
	this.pitch = 0; // anticlockwise from right (x)
	this.roll = 0; // anticlockwise from front (y)

	// TODO - Proper Vector object
	this.accelx = 0;
	this.accely = 0;
	this.accelz = 0;

	// TODO - Proper Vector object
	this.velx = 0;
	this.vely = 0;
	this.velz = 0;

	// TODO - Proper Vector object
	this.posx = 0;
	this.posy = 0;
	this.posz = 0;

	this.id = 0;
}

util.inherits(exports.OS_PACK, baseClient.pkt);

/**
 * Client
 * Probably better considered as an OutSim Connection
 */
var Client = function(options, log)
{
	var self = this;

	baseClient.client.call(this, options, log);

	self.stream = dgram.createSocket("udp4");

	// 'this' context that plugin functions are call
	self.ctx.outsim = exports;
};

util.inherits(Client, baseClient.client);

Client.prototype.connect = function()
{
	var self = this;

	self.emit('preconnect');

	// data
	self.stream.on('message', function(data, rinfo)
	{
		if (data.length <= 64)
			return;
		self.receive.call(self, data);
	});

	self.stream.bind(self.options.port);
}

Client.prototype.disconnect = function()
{
	var self = this;

	self.stream.close();
}

Client.prototype.send = function(pkt)
{
	return;
}

Client.prototype.receive = function(data)
{
	var self = this;

	var pkt = new exports.OS_PACK;
	pkt.unpack(data);

	self.log.verbose('Emitting event OS_PACK');
	self.emit('OS_PACK', pkt);
}

exports.client = Client;

}(typeof exports === "undefined"
        ? (this.outsim = {})
        : exports));

