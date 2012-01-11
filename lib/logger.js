"use strict";

var fs = require('fs');

var Logger = function(options)
{
	var defaults = {
		'levels': { 'crit': 0, 'error': 1, 'warn': 2, 'notice': 3, 'info': 4, 'debug': 5 },
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

Logger.prototype.setLevel = function(level)
{
	if (typeof level == 'number')
		this.options.level = level;

	if (!(level in this.options.levels))
		throw new Error('Unknown log level');

	this.options.level = this.options.levels[level];
}

Logger.prototype.log = function(level, message)
{
	if (this.options.level < this.options.levels[level])
		return;

	if (typeof message === 'function')
		message = message();

	return this.write({ severity: level.toUpperCase(), message: message });
}

Logger.prototype.write = function(options)
{
	var d = new Date;
	var msg = '[' + d.toISOString() + ' ' + options.severity + '] ' + options.message + '\n';

	this.options.stream.write(msg);
	msg = null;
	d = null;
}

Logger.prototype.define = function(logger, level)
{
	return logger[level] = function(message)
	{
		return this.log(level, message);
	};
}

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

Logger.prototype.merge = function(defaults, options)
{
	var merged = defaults;

	for (var attr in options)
		merged[attr] = options[attr];

	return merged;
}

exports.create = function(options)
{
	return new Logger(options);
}
