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
	var chars = [];

	var len = 0;
	for(var i = 0; i < str.length; i++)
	{
		var c = str.charCodeAt(i);
		var r = _codepageTables[from][c];
		var l = 0;

		// we don't know it, assume its the same charcode
		if (!r)
			r = c;

		// unknown character, replace with '?'
		if ((c != 0) && (r == 0))
			r = 0x3f;

		// WTF is this madness?
		// Right, so our codepages->utf8 tables have the equivilent character
		// code value, however we just can't shove that into a buffer and
		// then print/write that out to a file descriptor because that's not the 
		// end of the utf8 story.
		//
		// utf8 characters have a generic "header", when written. 
		// If a character is greater than 1 byte in length, the first byte has
		// as many leading 1 bits as the total number of bytes in the sequence,
		// followed by a 0 bit. Any succeeding bytes are all marked by a leading 
		// 10 bit pattern. remaining bits in the byte sequence are concatenated 
		// to form the unicode code point value.
		// This is why it's common to write a utf8 character as \u00a9, or
		// U+00a9. See? Learnt something new.
		//
		// So as an example, take the euro symbol which is 0x20ac (or rather
		// \u20ac).
		// 0x20ac   = 00000000 10100010
		// + header = 11000010 10100010 = 0xc2a2
		//
		// Here we're calculating how long the resulting buffer will be in bytes
		// by looking at the character we want to output and making an
		// assumption based on how many bytes we need to use to encode it
		// properly as a unicode code point value
		if (c < 0x80)
			l = 1; // byte 
		else if (c < 0x800)
			l = 2; // 2 byte 
		else if (c < 0x10000)
			l = 3; // 3 byte  
		else if (c < 0x200000)
			l = 4; // 4 byte 
		else if (c < 0x4000000)
			l = 5; // 5 byte
		else
			l = 6; // 6 byte

		len += l;
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
		// The following has basically been lifted from Joe's Own Editor
		// utf8.c
		// I struggled with my own implementation and gave up in the end
		// 

		// (C) 2004 Joseph H. Allen
		// "Ported" for my purposes
		if (c < 0x80)
		{
			// byte
			buf[j++] = c;
		}
		else if (c < 0x800)
		{
			// 2 byte
			buf[j++] = (0xc0|(c>>6));
			buf[j++] = (0x80|(c&0x3f));
		}
		else if (c < 0x10000)
		{
			// 3 byte
			buf[j++] = (0xe0|(c>>12));
			buf[j++] = (0x80|((c>>6)&0x3f));
			buf[j++] = (0x80|(c&0x3f));
		}
		else if(c < 0x200000)
		{
			// 4 byte
			buf[j++] = (0xf0|(c>>18));
			buf[j++] = (0x80|((c>>12)&0x3f));
			buf[j++] = (0x80|((c>>6)&0x3f));
			buf[j++] = (0x80|(c&0x3f));
		}
		else if (c < 0x4000000)
		{
			// 5 byte
			buf[j++] = (0xf8|(c>>24));
			buf[j++] = (0x80|((c>>18)&0x3f));
			buf[j++] = (0x80|((c>>12)&0x3f));
			buf[j++] = (0x80|((c>>6)&0x3f));
			buf[j++] = (0x80|((c)&0x3f));
		}
		else
		{
			// 6 byte
			buf[j++] = (0xfC|(c>>30));
			buf[j++] = (0x80|((c>>24)&0x3f));
			buf[j++] = (0x80|((c>>18)&0x3f));
			buf[j++] = (0x80|((c>>12)&0x3f));
			buf[j++] = (0x80|((c>>6)&0x3f));
			buf[j++] = (0x80|((c)&0x3f));
		}

		// end of ported code
	}

	return buf.toString('utf8');
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

