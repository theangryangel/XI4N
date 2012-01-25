"use strict";

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
	'^h': '#',
	'^^': '^'
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
	console.log(from);

	var chars = [];

	var len = 0;
	for(var i = 0; i < str.length; i++)
	{
		var c = str.charCodeAt(i);
		var r = _codepageTables[from][c];

		// we don't know it, assume its the same charcode
		if (!r)
			r = c;

		// unknown character, replace with '?'
		if ((c != 0) && (r == 0))
			r = 0x3f;

		if (c < 0x80)
			len++; // single byte
		else if (c < 0x800)
			len = len + 2; // double byte
		else if (c < 0x10000)
			len = len + 3; // triple byte

		// push onto our array of chars
		chars.push(c);
	}

	// now we know how long our buffer needs to be
	// and we have our converted characters
	var buf = new Buffer(len);
	buf.fill(0);

	var p = 0;

	for(var i = 0, j = 0, c = chars[0]; c = chars[i], i < chars.length; i++)
	{
		console.log("j = %d", j);

		if (chars[i] < 0x80)
		{
			console.log('single byte');
			buf[j++] = c;
			continue;
		}
		else if (chars[i] < 0x800)
		{
			console.log('double');
			buf[j++] = (0xc0|(c >> 6));
			buf[j++] = (0x80|(c & 0x3f));
			continue;
		}
		else if (chars[i] < 0x10000)
		{
			console.log('triple');
			buf[j++] = (0xe0|(c>>12));
			buf[j++] = (0x80|((c>>6)&0x3f));
			buf[j++] = (0x80|(c&0x3f));
			continue;
		}
		else if(chars[i] < 0x200000)
		{
			console.log('quad');
			continue;
		}
	}

	console.log(buf);
	console.log(buf.toString('binary'));
	return buf.toString('binary');
}

exports.toUTF8 = function(str)
{
	try
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
	catch(e)
	{
		console.log(e);
		debugger;
	}
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

