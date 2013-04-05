"use strict";

var util = require('util'),
	path = require('path'),
	express = require('express'),
	socketio = require('socket.io');

var plugin = function(options)
{
	this.app = express.createServer();
	this.io = socketio.listen(express):

	this.io.set('log level', 1);

	// disable the layout
	this.app.set("view options", { layout: false });

	// listen on the default port
	this.app.listen(options['http-port'] || 8080);

	// setup /static to map to ./static
	this.app.use('/static', express.static(__dirname + '/static'));

	// setup / to map to ./views
	this.app.use(express.static(__dirname + '/views'));

	// render index.html as /
	this.app.get('/', function (req, res)
	{
		res.render('index.html');
	});
}

plugin.prototype.associate = function(client)
{
	var self = this;

	client.log.info('Registering gauges plugin');

	client.on('connect', function()
	{
		var p = new this.insim.IS_SMALL;
		p.subt = this.insim.SMALL_SSG;
		p.uval = 10;

		this.send(p);
	});

	client.on('OG_PACK', function(p)
	{
		self.io.sockets.emit('OG_PACK', p);
	});
}

module.exports = plugin;
