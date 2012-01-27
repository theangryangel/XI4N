var livemap = {
	'clients': {},
	'getClients': function()
	{
		var list = [];

		for (var i in this.clients)
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
		io.sockets.emit('maps', livemap.getClients.call(livemap));

		console.log('on connection');

		console.log(livemap);

		console.log(livemap.getClients.call(livemap));

		console.log(livemap.clients);

		socket.on('join', function(map)
		{
			if (socket.map)
				socket.leave(socket.map);

			if ((map) && (map.length > 0))
			{
				socket.join(map);
				socket.map = map;

				// send list of players and current positions
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
		console.log('got state:server');
		console.log(joined);

		console.log(this.client.state.hname);

		var state = this.client.state.hname;

		if (joined)
		{
			livemap.clients[this.client.id] = { 'hostname': state.hname, 'track': state.track, 'layout': state.lname };
			console.log('added');
			console.log({ 'hostname': this.client.state.hname, 'track': this.client.state.track, 'layout': this.client.state.lname });
		}
		else
			delete livemap.clients[this.client.id];

	 console.log('post state:server');
		console.log(livemap.getClients());

		// notify any sockets of this.client's arrival/departure
		io.sockets.emit('maps', livemap.getClients());
	});

	var plyrCompact = function(p)
	{
		if (!p)
			return;

		return {
			'plid': p.plid,
			'pname': p.pname, 'cname': p.cname,
			'pitting': p.pitting,
			'position': p.position,
	   		'x': p.x, 'y': p.y, 'z': p.z,
			'lapsdone': p.lapsdone
		};
	}

	this.client.registerHook('state:track', function(plid)
	{
		io.sockets.in(this.client.id).emit('track', {
			'id': this.client.id,
			'hostname': this.client.state.hname, 
			'track': this.client.state.track,
			'layout': this.client.state.lname
		});
	});

	this.client.registerHook('state:plyrnew', function(plid)
	{
		var p = this.client.state.getPlyrByPlid(plid);

		if (!p)
			return; // some how got a plid that we don't know about in the state

		io.sockets.in(this.client.id).emit('plyrnew', plyrCompact(p));
	});

	this.client.registerHook('state:plyrleave', function(plid)
	{
		var p = this.client.state.getPlyrByPlid(plid);

		if (!p)
			return; // some how got a plid that we don't know about in the state

		io.sockets.in(this.client.id).emit('plyrleave', plid);
	});

	this.client.registerHook('state:plyrupdate', function(plids)
	{
		var update = [];

		for (var i in plids)
		{
			var p = this.client.state.getPlyrByPlid(plids[i]);
			if (!p)
				continue;

			update.push(plyrCompact(p));
		}

		io.sockets.in(this.client.id).emit('plyrsupdate', update);
	});

	this.client.registerHook('IS_MSO', function(pkt)
	{
		// system or user msgs only
		// TODO re-encode crazy string as utf8
		if (pkt.usertype <= this.insim.MSO_USER)
			io.sockets.in(this.client.id).emit('chat', pkt);
	});
}