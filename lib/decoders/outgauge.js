"use strict";

var util = require('util'),
	packet = require('./base');

exports.OG_PACK = function(buf)
{
	this._fmt = '<L4sHBBfffffffLLfff16s16s';

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

	this.unpack(buf);
}

util.inherits(exports.OG_PACK, packet);

exports.decode = function(data)
{
	if (data.length == 92 || data.length == 96)
		return new exports.OG_PACK(data);

	return null;
}
