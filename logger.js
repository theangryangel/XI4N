var Logger = function(options)
{
	this.options = options || {
		'levels': { 'crit': 0, 'error': 1, 'warn': 2, 'notice': 3, 'info': 4, 'debug': 5 },
		'level' : 1,
	};

	for (level in this.options.levels)
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
	delete msg;
	delete d;

	return;
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
