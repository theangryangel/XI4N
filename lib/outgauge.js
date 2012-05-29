"use strict";

(function(exports)
{

var util = require('util'),
	insim = require('./insim');

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

exports.OG_PACK = function()
{
	this._PACK = '<L4sHBBfffffffLLfff16s16sl';

	this.time = 0;	// time in milliseconds (to check order)
	this.car = ""; // car name
	this.flags = 0;	// info (see og_x below)
	this.gear = 0;	// reverse:0, neutral:1, first:2...
	this.plid = 0;	// unique id of viewed player (0 = none)
	this.speed = 0;	// m/s
	this.rpm = 0;	// rpm
	this.turbo = 0;	// bar
	this.engtemp = 0; // c
	this.fuel = 0; // 0 to 1
	this.oilpressure = 0; // bar
	this.oiltemp = 0; // c
	this.dashlights = 0; // dash lights available (see dl_x below)
	this.showlights = 0; // dash lights currently switched on
	this.throttle = 0; // 0 to 1
	this.brake = 0;	// 0 to 1
	this.clutch = 0; // 0 to 1
	this.display1 = ""; // usually fuel
	this.display2 = ""; // usually settings
	this.id = 0; // optional - only if outgauge id is specified
}

util.inherits(exports.OG_PACK, insim.IS_Abstract);

}(typeof exports === "undefined"
        ? (this.outgauge = {})
        : exports));

