var livemap = {
	'clients': {},
	'toList': function()
	{
		var list = [];

		for (var i in this.hosts)
			list.push({ 'hostname': this.clients[i].hname, 'track': this.clients[i].track, 'layout': this.clients[i].lname });

		return list;
	}
};

// setup express and socket.io
var util = require('util'),
	express = require('express').createServer(),
	io = require('socket.io').listen(express);

exports.construct = function(options)
{
	io.set('logger'), this.logger);
	io.set('log level', 1);

	// disable the layout
	express.set("view options", { layout: false });

	// setup underscore as our templating engine
	// jade makes me feel ill
	express.register('.html', {
		compile: function(str, options)
		{
			var compiled = require('underscore').template(str);
			return function(locals) {
				return compiled(locals);
			};
		}
	});

	// set our templates to live in livemap/views/
	express.set('views', __dirname + '/livemap2/views');

	// listen on the default port
	express.listen(options['http-port'] || 8080);

	// setup /static to map to ./livemap/static
	express.use('/static', require('express').static(__dirname + '/livemap2/static'));

	// render index.html as /
	express.get('/', function (req, res)
	{
		res.render('index.html', { port: options['http-port'] || 8080 });
	});

	// on connection, send the list of insim client connections
	// and hook up all our callbacks
	io.sockets.on('connection', function(socket)
	{
		io.sockets.emit('maps', livemaps.toList());

		socket.on('join', function(map)
		{
			if (socket.map)
				socket.leave(socket.map);

			if ((map) && (map.length > 0))
			{
				socket.join(map);
				socket.map = map;

				// send list of players
			}
		});

		socket.on('leave', function()
		{
			if (socket.map)
				socket.leave(socket.map);
		});

		socket.on('disconnect', function()
		{
			if (socket.map)
				socket.leave(socket.map);
		});
	});
}

exports.init = function()
{
	this.log.info('Registering LiveMap2 plugin');

	this.client.isiFlags |= this.insim.ISF_MCI;

	// setup state update hooks
	// these all depend on state.js

	this.client.registerHook('state:server', function(joined)
	{
		if (joined)
			livemaps.clients[this.client.id] = { 'hostname': this.state.hname,	'track': this.state.track, 'layout': this.state.lname };
		else
			delete livemaps.clients[this.client.id];

		// notify any sockets of this.client's arrival/departure
		io.sockets.emit('maps', livemaps.toList());
	});

	this.client.registerHook('state:connnew', function(ucid)
	{
	});

	this.client.registerHook('state:connleave', function(ucid)
	{
	});

	this.client.registerHook('state:connren', function(ucid)
	{
	});

	this.client.registerHook('state:plyrnew', function(plid)
	{
	});

	this.client.registerHook('state:plyrleave', function(plid)
	{
	});

	this.client.registerHook('state:plyrswap', function(plid)
	{
	});

	this.client.registerHook('state:plyrupdate', function(plids)
	{
	});

	this.client.registerHook('IS_MSO', function(pkt)
	{
		// system or user msgs only
		// TODO re-encode crazy string as utf8
		if (pkt.usertype <= this.insim.MSO_USER)
			io.sockets.in(this.client.id).emit('chat', pkt);
	});
}
