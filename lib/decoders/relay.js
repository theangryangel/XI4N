"use strict";

var util = require('util'),
	base = require('./base'),
	struct = require('jspack-arraybuffer');

exports.IR_ARQ = function(buf)
{
	this._fmt = 'BBBB';
	this.size = 4;
	this.type = 250;
	this.reqi = 0;
	this.sp0 = 0;

	this.unpack(buf);
}

util.inherits(exports.IR_ARQ, base);

exports.IR_ARP = function(buf)
{
	this._fmt = 'BBBB';
	this.size = 4;
	this.type = 251;
	this.reqi = 0;
	this.admin = 0;

	this.unpack(buf);
}

util.inherits(exports.IR_ARP, base);

// Host information - sub packet
exports.IR_HINFO = function(buf)
{
	this._fmt = '32s6sBB';
	this.hname = '';
	this.track = '';
	this.flags = '';
	this.numconns = 0;

	this.unpack(buf);
}

util.inherits(exports.IR_HINFO, base);

exports.IR_HLR = function(buf)
{
	this._fmt = 'BBBB';
	this.size = 4;
	this.type = 252;
	this.reqi = 0;
	this.sp0 = 0;

	this.unpack(buf);
}

util.inherits(exports.IR_HLR, base);

exports.IR_HOS = function(buf)
{
	this._fmt = 'BBBB';
	this.size = 0;
	this.type = 253;
	this.reqi = 0;
	this.numhosts = 0;

	this.info = [];

	this.unpack(buf);
}

util.inherits(exports.IR_HOS, base);

exports.IR_HOS.prototype.unpack = function(buf)
{
	if (!buf)
		return;

	var self = this;

	var data = struct.unpack(this._fmt, buf, 0);

	var properties = this.getProperties();

	// unpack the header
	for (var i = 0; i < properties.length; i++)
	{
		if (properties[i] == "info")
			continue;

		var t = data[i];

		// automatically deal with null terminated strings
		if ((typeof data[i] == 'string') && (data[i].length > 0))
			t = self.getNullTermdStr(t);

		self[properties[i]] = t;
	}

	// unpack the results
	for(var i = 0; i < self.numhosts; i++)
	{
		// Next packet start position
		var start = 4 + (i * 40);

		var c = new IR_HINFO(buf.slice(start, start + 80));
		self.info.push(c);
	}
}

exports.IR_SEL = function(buf)
{
	this._fmt = 'BBBB32s16s16s';
	this.size = 68;
	this.type = 254;
	this.reqi = 0;
	this.zero = 0;

	this.hname = '';
	this.admin = '';
	this.spec = '';

	this.unpack(buf);
}

util.inherits(exports.IR_SEL, base);

exports.IR_ERR = function(buf)
{
	this._fmt = 'BBBB';
	this.size = 4;
	this.type = 255;
	this.reqi = 0;
	this.errno = 0;

	this.unpack(buf);
}

util.inherits(exports.IR_ERR, base);

exports.XLATE = {
	250: 'IR_ARQ',
	251: 'IR_ARP',
	252: 'IR_HLR',
	253: 'IR_HOS',
	254: 'IR_SEL',
	255: 'IR_ERR'
};

exports.getName = function(id)
{
	var name = exports.XLATE[id];

	if ((name == undefined) || (name == null))
		return null;

	return name;
};

exports.getId = function(name)
{
	for (var i in exports.XLATE)
	{
		if (exports.XLATE[i] == name)
			return i;
	}

	return -1;
}

exports.decode = function(data)
{
	var id = data.readUInt8(1);

	if (id < 1)
		return;

	var name = exports.getName(id);
	if (name == null)
		return null;

	return new exports[name](data);
}
