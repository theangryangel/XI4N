"use strict";

(function(exports)
{

/**
 * Module dependencies.
 */
var fs = require('fs');

exports.tidyParseString = function(str)
{
	var regex = [
		{ pattern: /[\w]*(\/\/).*$/mg, replace: '' }, // remove "//" comments
		{ pattern: /\'/mg, replace: '"' }, // replace single with double quotes
		{ pattern: /([\]}]),([\r\n\s\t]*)?([\]}])/mg, replace: '$1 $3' }, // remove any mis-placed ","
	];

	var output = str;

	for (var i in regex)
		output = output.replace(regex[i].pattern, regex[i].replace);

	return JSON.parse(output);
}

exports.tidyParseFile = function(file, encoding)
{
	var encoding = encoding || 'utf8';
	return exports.tidyParseString(fs.readFileSync(file, encoding));
}

}(typeof exports === "undefined"
        ? (this.jsonTidy = {})
        : exports));
