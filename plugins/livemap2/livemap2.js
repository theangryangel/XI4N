'use strict';

// setup app and socket.io
var util = require('util'),
	path = require('path'),
	express = require('express'),
	http = require('http'),
	socketio = require('socket.io'),
	_ = require('underscore');

var plyrCompact = function(p)
{
	if (!p)
		return;

	return {
		'plid': p.plid,
		'pname': p.pname, 
		'cname': p.cname,
		'pitting': p.pitting,
		'position': p.position,
		'position_original': p.position_original,
   		'x': p.x, 
		'y': p.y, 
		'z': p.z,
		'lapsdone': p.lapsdone,
		'ltime': p.ltime,
		'btime': p.btime
	};
}

var plugin = function(options)
{
	var self = this;

	this.livemap = {
		'clients': {},
		'getClients': function()
		{
			var list = [];
	
			for (var i in this.clients)
				list.push({ 
					'id': i, 
					'hostname': this.clients[i].hname, 
					'track': this.clients[i].track, 
					'layout': this.clients[i].lname,
					'laps': this.clients[i].racelaps,
					'qual': this.clients[i].qualmins
				});

			return list;
		}
	};

	this.options = _.defaults(options, {
		'http-port': 8080
	});

	this.app = express();
	this.server = http.createServer(this.app);
	this.io = socketio.listen(server);

	this.io.set('log level', 1);

	// disable the layout
	this.app.set("view options", { layout: false });

	// listen on the default port
	this.server.listen(this.options.['http-port']);

	// setup /static to map to ./static
	this.app.use('/static', express.static(__dirname + '/static'));
	this.app.use('/static/pth', express.static(path.join(__dirname, '../../data/pth/')));

	// setup / to map to ./views
	this.app.use(express.static(__dirname + '/views'));

	// render index.html as /
	this.app.get('/', function (req, res)
	{
		res.render('index.html');
	});

	// on connection, send the list of insim client connections
	// and hook up all our callbacks
	this.io.sockets.on('connection', function(socket)
	{
		self.io.sockets.emit('maps', self.livemap.getClients());

		socket.on('join', function(map)
		{
			if (socket.map)
				socket.leave(socket.map);

			if ((map) && (map.length > 0))
			{
				socket.join(map);
				socket.map = map;

				var list = [];
				for (var i in self.livemap.clients[map].plyrs)
					list.push(plyrCompact(self.livemap.clients[map].plyrs[i]));

				// send list of players and current positions
				socket.emit('plyrsnew', list);
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

plugin.prototype.associate = function(client)
{
	var self = this;

	client.log.info('Registering LiveMap2 plugin');
	client.options.isiflags |= client.insim.ISF_MCI;

	// setup state update hooks
	// these all depend on state.js
	client.on('state:ready', function()
	{
		self.livemap.clients[this.id] = this.state;
	});

	client.on('state:notready', function()
	{
		delete self.livemap.clients[this.id];
	});

	client.on('state:server', function(joined)
	{
		self.io.sockets.emit('maps', self.livemap.getClients());
	});

	client.on('IS_RST', function(pkt)
	{
		self.io.sockets.in(this.id).emit('restart');
	});

	client.on('state:track', function()
	{
		self.io.sockets.in(self.id).emit('track', {
			'id': self.id,
			'hostname': self.state.hname, 
			'track': self.state.track,
			'layout': self.state.lname,
			'laps': self.state.racelaps,
			'qualmins': self.state.qualmins
		});

		self.io.sockets.emit('maps', self.livemap.getClients());
	});

	client.on('state:layout', function()
	{
		self.io.sockets.in(self.id).emit('track', {
			'id': self.id,
			'hostname': self.state.hname, 
			'track': self.state.track,
			'layout': self.state.lname,
			'laps': self.state.racelaps,
			'qualmins': self.state.qualmins
		});

		self.io.sockets.emit('maps', self.livemap.getClients());
	});

	client.on('state:plyrnew', function(plid)
	{
		var p = self.state.getPlyrByPlid(plid);

		if (!p)
			return; // some how got a plid that we don't know about in the state

		if (!self.livemap.clients[self.id])
			return; // a state we don't know about

		var c = plyrCompact(p);
		self.io.sockets.in(self.id).emit('plyrnew', c);
	});

	client.on('state:plyrleave', function(plid)
	{
		self.io.sockets.in(self.id).emit('plyrleave', plid);
	});

	client.on('state:plyrupdate', function(plids)
	{
		var update = [];

		for (var i in plids)
		{
			var p = self.state.getPlyrByPlid(plids[i]);
			if (!p)
				continue;

			update.push(plyrCompact(p));
		}

		self.io.sockets.in(self.id).emit('plyrsupdate', update);
	});

	client.on('IS_MSO', function(pkt)
	{
		// system or user msgs only
		if (pkt.usertype <= self.insim.MSO_USER)
		{
			var line = {
				'plid': pkt.plid,
				'usertype': pkt.usertype,
				'msg': pkt.msg.substr(pkt.msg.textstart)
			};
			self.io.sockets.in(self.id).emit('chat', line);
		}
	});
}

module.exports = plugin;
