"use strict";

var util = require('util'),
	path = require('path'),
	express = require('express').createServer(),
	io = require('socket.io').listen(express),
	outgauge = null,
	udpPort = 0;

exports.construct = function(options)
{
	udpPort = options.port;

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

exports.init = function(options)
{
	this.log.info('Registering gauges plugin');

	this.client.udpPort = udpPort;

	this.client.on('connect', function()
	{
		var p = new this.insim.IS_SMALL;
		p.subt = this.insim.SMALL_SSG;
		p.uval = 10;
		this.client.send(p);
	});

	outgauge = new this.outgauge.client({ port: udpPort }, this.log);

	outgauge.on('OG_PACK', function(p)
	{
		io.sockets.emit('OG_PACK', p);
	});

	outgauge.connect();
}

exports.term = function()
{
	if (outgauge)
		outgauge.disconnect();
}
