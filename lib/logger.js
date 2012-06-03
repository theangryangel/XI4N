"use strict";

/**
 * Module dependencies.
 */
var fs = require('fs');

/**
 * Creates a logger instance
 *
 * @param {Object} options Options object
 * @api public
 */
var Logger = function(options)
{
	var defaults = {
		'levels': { 'crit': 0, 'error': 1, 'warn': 2, 'notice': 3, 'info': 4, 'debug': 5, 'verbose': 6 },
		'level': 5,
		'stream': process.stdout
	};

	this.options = this.merge(defaults, options);

	for (var level in this.options.levels)
		this.define(this, level);

	if (typeof this.options.level != 'number')
		this.setLevel(this.options.level);

	if (typeof this.options.stream != 'object')
		this.options.stream = this.name2stream(this.options.stream);

	defaults = null;
}

/**
 * Sets the logging level
 *
 * @param {String|Number} level Log level, may be a string or number
 * @api public
 */
Logger.prototype.setLevel = function(level)
{
	if (typeof level == 'number')
		this.options.level = level;

	if (!(level in this.options.levels))
		throw new Error('Unknown log level');

	this.options.level = this.options.levels[level];
}

/**
 * Logs a string, at a given level
 *
 * @param {Number} level
 * @param {String|Function} message
 * @api private
 */
Logger.prototype.log = function(level, message)
{
	if (this.options.level < this.options.levels[level])
		return;

	if (typeof message === 'function')
		message = message();

	return this.write({ severity: level.toUpperCase(), message: message });
}

/**
 * Writes a log message to the log stream. This may be any writable stream -
 * such as a file or a stdout/stderr
 *
 * @param {String} dst Destination
 * @param {Boolean} force
 * @api private
 */
Logger.prototype.write = function(options)
{
	var d = new Date;
	var msg = '[' + d.toISOString() + ' ' + options.severity + '] ' + options.message + '\n';

	this.options.stream.write(msg);
	msg = null;
	d = null;
}

/**
 * Creates a logging function for a given level
 *
 * @param {Object} logger Instance of a logger
 * @param {Number} level Log level
 * @api private
 */
Logger.prototype.define = function(logger, level)
{
	return logger[level] = function(message)
	{
		return this.log(level, message);
	};
}

/**
 * Converts a "name" to a stream. It matches stdout, stderr, or otherwise
 * assumes it's a file.
 *
 * @param {String} name
 * @return {Object}
 * @api private
 */
Logger.prototype.name2stream = function(name)
{
	var r = '';

	switch (name.toLowerCase())
	{
		case 'stdout':
		case 'stderr':
			r = process[name.toLowerCase()];
			break;
		case null:
		case '':
			r = process.stdout;
			break;
		default:
			r = fs.createWriteStream(name);
			break;
	}

	return r;
}

/**
 * Merges 2 objects
 *
 * @param {Object} defaults
 * @param {Object} options
 * @return {Object}
 * @api private
 */
Logger.prototype.merge = function(defaults, options)
{
	var merged = defaults;

	for (var attr in options)
		merged[attr] = options[attr];

	return merged;
}

/**
 * Returns an instance of logger
 *
 * @param {Object} [options]
 * @return {Object}
 * @api public
 */
exports.create = function(options)
{
	return new Logger(options);
}
