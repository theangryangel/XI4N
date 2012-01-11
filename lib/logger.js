"use strict";

var Logger = function(options)
{
	this.options = options || {
		'levels': { 'crit': 0, 'error': 1, 'warn': 2, 'notice': 3, 'info': 4, 'debug': 5 },
		'level' : 5,
	};

	for (var level in this.options.levels)
		Logger.define(this, level);
}

Logger.prototype.log = function(level, message)
{
	if (this.options.level < this.options.levels[level])
		return;

	if (typeof message === 'function')
		message = message();

	return this.write({ severity: level.toUpperCase(), message: message });
};

Logger.prototype.write = function(options)
{
	var d = new Date;
	var msg = "[" + d.toISOString() + " " + options.severity + "] " + options.message

	console.log(msg);
	msg = null;
	d = null;
};

Logger.define = function(logger, level)
{
	return logger[level] = function(message)
	{
		return this.log(level, message);
	};
};

exports.create = function(options)
{
	return new Logger(options);
}
