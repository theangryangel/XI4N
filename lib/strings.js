"use strict";

(function(exports)
{

var _codepageTables = require('./codepage-tables');

var _codepages = {
	'^L': 'cp1252', 
	'^G': 'iso-8859-7', 
	'^C': 'cp1251', 
	'^J': 'shift-jis', 
	'^E': 'iso-8859-2', 
	'^T': 'iso-8859-9', 
	'^B': 'iso-8859-13', 
	'^H': 'cp936', 
	'^S': 'cp949', 
	'^K': 'cp950'
}

var _specials = {
	'^v': '|',
	'^a': '*', 
	'^c': ':', 
	'^d': '\\',
	'^s': '/',
	'^q': '?',
	'^t': '"',
	'^l': '<',
	'^r': '>',
	'^h': '#' 
}

var _colours = {
	'^0': 'black', 
	'^1': 'red', 
	'^2': 'lightgreen', 
	'^3': 'yellow', 
	'^4': 'blue', 
	'^5': 'purple', 
	'^6': 'lightblue', 
	'^7': 'white', 
	'^8': 'darkgreen', 
	'^9': 'original'
}

exports._chunkToUTF8 = function(str, from)
{
	var len = 0;
	for(var i = 0; i < str.length; i++)
	{
		len++; // assume it's single byte

		if (!!(str.charCodeAt(i) >> 8))
			len++; // ok, its double byte
	}

	// now we know how long our buffer needs to be
	var buf = new Buffer(len);
	buf.fill(0);

	for(var i = 0, j = 0; i < str.length; i++)
	{
		var charcode = str.charCodeAt(i);
		var replacement = _codepageTables[from][charcode];

		// we don't know it, assume its the same charcode
		if (!replacement)
			replacement = charcode;

		// unknown character, replace with '?'
		if ((charcode != 0) && (replacement == 0))
			replacement = 0x3f;

		if (!!(replacement >> 8))
		{
			// double byte
			// actually it could be more, but i'm going to assume not
			buf[j++] = replacement >> 8; // high byte
			buf[j++] = replacement % (replacement >> 8); // low byte
			continue;
		}

		// single byte
		buf[j++] = replacement;
	}

	return buf.toString('utf8');
}

exports.toUTF8 = function(str)
{
	var deflt = _codepages[str.substr(0, 2)] || _codepages['^L'];

	var cp = deflt;
	var ret = '';
	var tmp = '';

	for (var i = 0; i < str.length; i++)
	{
		if ((str[i] == '^') && (_codepages['^' + str[i+1]]) && (str[i-1] != '^'))
		{
			if (tmp.length > 0)
			{
				ret += exports._chunkToUTF8(tmp, cp);
				tmp = '';
			}

			cp = _codepages['^' + str[++i]];

			continue;
		}

		tmp += str[i]; 
	}

	if (tmp.length > 0)
	{
		ret += exports._chunkToUTF8(tmp, cp);
		tmp = '';
	}

	return exports.translateSpecials(ret);
}

// translateSpecials
exports.translateSpecials = function(str)
{
	for (var i in _specials)
		str = str.replace(i, _specials[i]);

	return str;
}

// remColours
exports.remColours = function(str)
{
	return str.replace(/\^[012345679]+/g, '');
}

}(typeof exports === "undefined"
        ? (this.strings = {})
        : exports));
