'use strict';

var insim = require('./protocols/insim'),
	winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
    	new (winston.transports.Console)(),
	]
});

var i = 0;

var c = new insim(options, logger);
pong.associate(c, {});

c.on('disconnect', function()
{
	i++;
	if (i > 5)
		return;

	setTimeout(function(){ c.connect(); }, 1000 * i);
});

c.on('connect', function()
{
	i = 0;
});
