'use strict';

var winston = require('winston');

var ucfirst = function(string)
{
	string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var factory = function(options)
{
	var w = new winston.Logger();

	for (var i in options)
	{
		if (!options[i].type)
			continue;

		w.add(winston.transports[ucfirst(options[i].type)], options[i]);
	}
	
	return w;
}

module.exports = factory;
