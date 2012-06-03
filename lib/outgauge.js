"use strict";

(function(exports)
{

/**
 * Module dependencies
 */
var util = require('util'),
	baseClient = require('./client'),
	dgram = require('dgram');

// Translating LFS insim.h to jspack as follows -
// char	= c
// byte	= B
// word	= H
// short = h
// unsigned	= L
// int = l
// float = f
// char[16] = 16s

exports.OG_SHIFT = 1; // key
exports.OG_CTRL = 2; // key

exports.OG_TURBO = 8192; // show turbo gauge
exports.OG_KM = 16384; // if not set - user prefers MILES
exports.OG_BAR = 32768; // if not set - user prefers PSI

exports.DL_SHIFT = 1; // shift light
exports.DL_FULLBEAM = 2;
exports.DL_HANDBRAKE = 4;
exports.DL_PITSPEED = 8;
exports.DL_TC = 16;
exports.DL_SIGNAL_L = 32;
exports.DL_SIGNAL_R = 64;
exports.DL_SIGNAL_ANY = 128;
exports.DL_OILWARN = 256;
exports.DL_BATTERY = 512;
exports.DL_ABS = 1024;
exports.DL_SPARE = 2048;
exports.DL_NUM = 4096;

/**
 * Object that represents OutGauge packet.
 *
 * @api public
 * @extends pkt
 * @return {Object}
 */
exports.OG_PACK = function()
{
	this._PACK = '<L4sHBBfffffffLLfff16s16s';

	this.time = 0;
	this.car = ""; // Car name
	this.flags = 0;	// Info (see OG_x below)
	this.gear = 0; // Reverse:0, Neutral:1, First:2...
	this.plid = 0; // Unique ID of viewed player (0 = none)
	this.speed = 0; // M/S
	this.rpm = 0;// RPM
	this.turbo = 0; // BAR
	this.engtemp = 0; // C
	this.fuel = 0; // 0 to 1
	this.oilpressure = 0; // BAR
	this.oiltemp = 0; // C
	this.dashlights = 0; // Dash lights available (see DL_x below)
	this.showlights = 0; // Dash lights currently switched on
	this.Throttle = 0; // 0 to 1
	this.Brake = 0; // 0 to 1
	this.clutch = 0; // 0 to 1
	this.display1 = ""; // Usually Fuel
	this.display2 = ""; // Usually Settings
}

util.inherits(exports.OG_PACK, baseClient.pkt);

/**
 * Client object that represents an OutGauge connection.
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
	self.ctx.outgauge = exports;
};

util.inherits(Client, baseClient.client);

/**
 * Starts a listening socket that waits for OutGauge messages.
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
 	 	// TODO Whats generating the 32 byte messages? And whats the content?
		if (data.length < 92)
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

	var pkt = new exports.OG_PACK;
	pkt.unpack(data);

	self.log.verbose('Emitting event OG_PACK');
	self.emit('OG_PACK', pkt);
}

/**
 * Exports the OutSim client object
 *
 * @api public
 * @return {Object}
 */
exports.client = Client;

}(typeof exports === "undefined"
        ? (this.outgauge = {})
        : exports));

