"use strict";

(function(exports)
{

/**
 * Module dependencies
 */
var util = require('util'),
	baseClient = require('./client'),
	insim = require('./insim');

// Translating LFSW relay packets to jspack as follows -
// char	= c
// byte	= B
// word	= H
// short = h
// unsigned	= L
// int = l
// float = f
// char[16] = 16s

/**
 * Packet ID for IRP_ARQ
 *
 * @api public
 */
exports.IRP_ARQ = 250;

/**
 * Packet ID for IRP_ARP
 *
 * @api public
 */
exports.IRP_ARP = 251;

/**
 * Packet ID for IRP_HLR
 *
 * @api public
 */
exports.IRP_HLR = 252;

/**
 * Packet ID for IRP_HOS
 *
 * @api public
 */
exports.IRP_HOS = 253;

/**
 * Packet ID for IRP_SEL
 *
 * @api public
 */
exports.IRP_SEL = 254;

/**
 * Packet ID for IRP_ERR
 *
 * @api public
 */
exports.IRP_ERR = 255;

/**
 * Insim Relay Packet IR_HLR (Host List Request)
 * 
 * @api public 
 */
exports.IR_HLR = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.IRP_HLR;
	this.reqi = 0;
	this.sp0 = 0;
}

util.inherits(exports.IR_HLR, baseClient.pkt);

// IR_HOSTINFO flags
exports.HOS_SPECPASS = 1;
exports.HOS_LICENSED = 2;
exports.HOS_S1 = 4;
exports.HOST_S2 = 8;
exports.HOS_FIRST = 64;
exports.LAST = 128;

/**
 * Insim Relay Sub-packet containing HostInfo, used in IR_HOS
 * @api private
 */
exports.IR_HOSTINFO = function()
{
	this._PACK = '<32s6sBB';

	this.hname= "";
	this.track = "";
	this.flags = 0;
	this.numconns = 0;
}

util.inherits(exports.IR_HOSTINFO, baseClient.pkt);

/**
 * Insim Relay Packet IR_HOS (Online hosts, connected to LFSW Relay)
 * 
 * @api public 
 */
exports.IR_HOS = function()
{
	this._PACK = '<BBBB'; // partial pack string

	this.size = 4; // 4+ NumHosts * 40
	this.type = exports.IRP_HOS;
	this.reqi = 0;
	this.numhosts = 0;
	this.info = [];

	this.sp0 = 0;
}

util.inherits(exports.IR_HLR, baseClient.pkt);

// TODO custom unpack and pack functions for IR_HOS

/**
 * Insim Relay Packet IR_SEL (Select host)
 * 
 * @api public 
 */
exports.IR_SEL = function()
{
	this._PACK = '<BBBB32s16s16s';

	this.size = 68;
	this.type = exports.IRP_SEL;
	this.reqi = 0;
	this.zero = 0;

	this.hname = "";
	this.admin = "";
	this.spec = "";
}

util.inherits(exports.IR_SEL, baseClient.pkt);

/**
 * Insim Relay Packet IR_ArQ (Admin Request)
 * 
 * @api public 
 */
exports.IR_ARQ = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.IRP_ARQ;
	this.reqi = 0;
	this.admin = 0; // 0=admin, 1=admin
}

util.inherits(exports.IR_ARQ, baseClient.pkt);

/**
 * IR_ERR errno - Invalid packet
 * @api public
 */
exports.IR_ERR_PACKET = 1;

/**
 * IR_ERR errno - Invalid packet
 * @api public
 */
exports.IR_ERR_PACKET2 = 2;

/**
 * IR_ERR errno - Invalid hostname
 * @api public
 */
exports.IR_ERR_HOSTNAME = 3;

/**
 * IR_ERR errno - Invalid admin password
 * @api public
 */
exports.IR_ERR_ADMIN = 4;

/**
 * IR_ERR errno - Invalid spectator password
 * @api public
 */
exports.IR_ERR_SPEC = 5;

/**
 * IR_ERR errno - Invalid spectator password - none provided
 * @api public
 */
exports.IR_ERR_NOSPEC = 6;

/**
 * Insim Relay Packet IR_ERR
 * 
 * @api public 
 */
exports.IR_ERR = function()
{
	this._PACK = '<BBBB';

	this.size = 4;
	this.type = exports.IRP_ERR;
	this.reqi = 0;
	this.errno = 0; // error number
}

util.inherits(exports.IR_ERR, baseClient.pkt);

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

	self.buffer = new BufferList;
	self.stream = null;

	// should be set by plugins automagically
	// when the plugin init function is called
	self.isiFlags = 0;
	self.udpPort = 0;

	self.isHost = '';
	self.hostname = '';

	// 'this' context that plugin functions are call
	self.ctx.insim = exports;
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
}

/**
 * Closes the socket that is listening for data.
 *
 * @api public
 */
Client.prototype.disconnect = function()
{
	var self = this;

	var p = new exports.IS_TINY;
	p.subt = exports.TINY_CLOSE;
	self.send(p);

	self.stream.end();
}

/**
 * Sends a packet to LFS
 *
 * @api public
 * @param {Object} pkt
 */
Client.prototype.send = function(pkt)
{
	var self = this;

	var b = new Buffer(pkt.pack());
	self.stream.write(b);

	b = null;
	pkt = null; // should be the last point we care about the packet. but do we want to assume this?
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

