"use strict";

var util = require('util'),
	packet = require('./base');

exports.OS_PACK = function(buf)
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

	this.unpack(buf);
}

util.inherits(exports.OS_PACK, packet);

exports.decode = function(data)
{
	// TODO
	return null;
}
