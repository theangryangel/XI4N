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

/**
 * Object that represents OutSim packet.
 *
 * @api public
 * @extends pkt
 * @return {Object}
 */
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
 * Client object that represents an OutSim connection.
 *
 * @api public
 * @extends Client
 * @param {Object} options Options object
 * @param {Object} [log] Logger instance
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

/**
 * Starts a listening socket that waits for OutSim messages.
 *
 * @api public
 */
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

/**
 * Closes the socket that is listening for data.
 *
 * @api public
 */
Client.prototype.disconnect = function()
{
	var self = this;

	self.stream.close();
}

/**
 * No-op for OutSim.
 *
 * @ignore
 * @param {Object} pkt Packet instance
 */
Client.prototype.send = function(pkt)
{
	return;
}

/**
 * Receives data from the socket and parses the data, if it's successfully
 * parsed it emit the event to the relevant subscribers
 *
 * @api public
 * @param {Buffer} data 
 */
Client.prototype.receive = function(data)
{
	var self = this;

	var pkt = new exports.OS_PACK;
	pkt.unpack(data);

	self.log.verbose('Emitting event OS_PACK');
	self.emit('OS_PACK', pkt);
}

/**
 * Exports the OutSim client object
 *
 * @api public
 * @return {Object}
 */
exports.client = Client;

}(typeof exports === "undefined"
        ? (this.outsim = {})
        : exports));

