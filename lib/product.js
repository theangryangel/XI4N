"use strict";

/**
 * Module dependencies
 */
var path = require('path'),
	fs = require('fs'),
	basedir = path.join(__dirname, '..'),
	pkg = JSON.parse(fs.readFileSync(basedir + '/package.json', 'utf8'));

/**
 * Returns the base directory of the globally installed version of xi4n.
 * This is useful for accessing bundled data.
 *
 * @api public
 * @return {String} 
 */
exports.basedir = basedir;

/**
 * Returns the name of this package. Unless altered this should be "xi4n". This
 * is parsed from package.json.
 *
 * @api public
 * @return {String} 
 */
exports.name = pkg.name;

/**
 * Returns this version of xi4n. This is parsed from package.json.
 *
 * @api public
 * @return {String} 
 */
exports.version = pkg.version;

/**
 * Returns a concatencated string of the product name and version. This is
 * parsed from the package.json.
 *
 * @api public
 * @return {String} 
 */
exports.full = pkg.name + ' v' + pkg.version;

