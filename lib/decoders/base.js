"use strict";

var struct = require('jspack-buffer');

var packet = function(buf)
{
	this._fmt = '';
}

packet.prototype.getProperties = function(values)
{
	var properties = [];
	for(var propertyName in this)
	{
		if (typeof this[propertyName] == 'function')
			continue;

		var c = propertyName.charAt(0);
		if (c == '_')
			continue;

		properties.push(propertyName);
	}

	return properties;
}

packet.prototype.getNullTermdStr = function(str)
{
	// deal with null terminated string
	var idx = str.indexOf('\0');
	if (idx < 0)
		return str;

	return str.substr(0, idx);
}

packet.prototype.unpack = function(buf)
{
	if (!buf)
		return;

	var payload = buf;

	var data = struct.unpack(this._fmt, payload, 0);

	var properties = this.getProperties();

	for (var i = 0; i < properties.length; i++)
	{
		var t = data[i];

		if ((typeof data[i] == 'string') && (data[i].length > 0))
			t = this.getNullTermdStr(t);

		this[properties[i]] = t;
	}
}

packet.prototype.pack = function()
{
	var properties = this.getProperties();
	var values = [];
	for (var i = 0; i < properties.length; i++)
		values.push(this[properties[i]]);

	return struct.pack(this._fmt, values);
}

module.exports = packet;
