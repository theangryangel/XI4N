"use strict";

var util = require('util'),
	path = require('path'),
	express = require('express').createServer(),
	io = require('socket.io').listen(express);

exports.construct = function(options)
{
	io.set('log level', 1);

	// disable the layout
	express.set("view options", { layout: false });

	// listen on the default port
	express.listen(options['http-port'] || 8080);

	// setup /static to map to ./static
	express.use('/static', require('express').static(__dirname + '/static'));

	// setup / to map to ./views
	express.use(require('express').static(__dirname + '/views'));

	// render index.html as /
	express.get('/', function (req, res)
	{
		res.render('index.html');
	});
}

exports.associate = function(options)
{
	this.log.info('Registering gauges plugin');

	this.on('connect', function()
	{
		var p = new this.insim.IS_SMALL;
		p.subt = this.insim.SMALL_SSG;
		p.uval = 10;
		this.send(p);
	});

	this.on('OG_PACK', function(p)
	{
		io.sockets.emit('OG_PACK', p);
	});
}
