"use strict";

(function(exports)
{

/**
 * Module dependencies.
 */
var fs = require('fs');

/**
 * Takes a string, attempts to remove anything that prevents a string from being
 * parsed by JSON.parse. 
 *   * Removes commented out lines
 *   * Replaces single quotes with double quotes
 *   * Removes any mis-placed commas
 *
 * @param {String} str String that gets cleaned and turned into a JSON parsed
 * object
 * @api public
 */
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


/**
 * Reads in a file and passes it through tidyParseString()
 *
 * @param {String} dst File path
 * @param {String} [encoding] File encoding, defaults to utf8
 * @api public
 */
exports.tidyParseFile = function(file, encoding)
{
	var encoding = encoding || 'utf8';
	return exports.tidyParseString(fs.readFileSync(file, encoding));
}

}(typeof exports === "undefined"
        ? (this.jsonTidy = {})
        : exports));
