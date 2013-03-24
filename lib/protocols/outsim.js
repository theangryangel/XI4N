"use strict";

var util = require('util'),
	base = require('./base'),
	outsim = require('../decoders/outsim'),
	product = require('../product');

var client = function(options, log)
{
	base.call(this, options, log);

	this.decoders = [
		outsim
	];

	this.relay = relay;
	this.insim = insim;

	this.connection = new udp(null, null);
}

util.inherits(client, base);

client.prototype.connect = function()
{
	this.emit('preconnect');
	this.connection.connect();
}

client.prototype.disconnect = function()
{
	this.emit('predisconnect');
	this.connection.disconnect();
}

client.prototype.send = function(packet)
{
	this.log.error('Cannot send packet on a pure OutSim connection! Receive only!');
	throw new Error('Cannot send packet on a pure OutSim connection! Receive only!');
}

module.exports = client;
