"use strict";

var util = require('util'),
	base = require('./base'),
	outgauge = require('../decoders/outgauge'),
	product = require('../product');

var client = function(options, log)
{
	this.defaults = {
		port: 12345,
		host: null
	};

	base.call(this, options, log);

	this.decoders = [
		outgauge
	];

	this.relay = relay;
	this.insim = insim;

	this.connection = new udp(this.options.port, this.options.host);
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
	this.log.error('Cannot send packet on a pure Outgauge connection! Receive only!');
	throw new Error('Cannot send packet on a pure Outgauge connection! Receive only!');
}

module.exports = client;
