var livemap = {
	'clients': {},
	'getClients': function()
	{
		var list = [];

		for (var i in thiss)
			list.push({ 
				'id': i, 
				'hostname': thiss[i].hname, 
				'track': thiss[i].track, 
				'layout': thiss[i].lname,
				'laps': thiss[i].racelaps,
				'qual': thiss[i].qualmins
			});

		return list;
	}
};

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

// setup express and socket.io
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
	express.use('/static/pth', require('express').static(path.join(__dirname, '../../data/pth/')));

	// setup / to map to ./views
	express.use(require('express').static(__dirname + '/views'));

	// render index.html as /
	express.get('/', function (req, res)
	{
		res.render('index.html');
	});

	// on connection, send the list of insim client connections
	// and hook up all our callbacks
	io.sockets.on('connection', function(socket)
	{
		io.sockets.emit('maps', livemap.getClients.call(livemap));

		socket.on('join', function(map)
		{
			if (socket.map)
				socket.leave(socket.map);

			if ((map) && (map.length > 0))
			{
				socket.join(map);
				socket.map = map;

				var list = [];
				for (var i in livemap.clients[map].plyrs)
					list.push(plyrCompact(livemap.clients[map].plyrs[i]));

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

exports.associate = function()
{
	this.log.info('Registering LiveMap2 plugin');

	this.options.isiflags |= this.insim.ISF_MCI;

	// setup state update hooks
	// these all depend on state.js
	this.on('state:ready', function()
	{
		livemap.clients[this.id] = this.state;
	});

	this.on('state:notready', function()
	{
		delete livemap.clients[this.id] = this.state;
	});

	this.on('state:server', function(joined)
	{
		// notify any sockets of this's arrival/departure
		io.sockets.emit('maps', livemap.getClients());
	});

	this.on('IS_RST', function(pkt)
	{
		io.sockets.in(this.id).emit('restart');
	});

	this.on('state:track', function()
	{
		io.sockets.in(this.id).emit('track', {
			'id': this.id,
			'hostname': this.state.hname, 
			'track': this.state.track,
			'layout': this.state.lname,
			'laps': this.state.racelaps,
			'qualmins': this.state.qualmins
		});

		io.sockets.emit('maps', livemap.getClients());
	});

	this.on('state:layout', function()
	{
		io.sockets.in(this.id).emit('track', {
			'id': this.id,
			'hostname': this.state.hname, 
			'track': this.state.track,
			'layout': this.state.lname,
			'laps': this.state.racelaps,
			'qualmins': this.state.qualmins
		});

		io.sockets.emit('maps', livemap.getClients());
	});

	this.on('state:plyrnew', function(plid)
	{
		var p = this.state.getPlyrByPlid(plid);

		if (!p)
			return; // some how got a plid that we don't know about in the state

		if (!livemap.clients[this.id])
			return; // a state we don't know about

		var c = plyrCompact(p);
		io.sockets.in(this.id).emit('plyrnew', c);
	});

	this.on('state:plyrleave', function(plid)
	{
		io.sockets.in(this.id).emit('plyrleave', plid);
	});

	this.on('state:plyrupdate', function(plids)
	{
		var update = [];

		for (var i in plids)
		{
			var p = this.state.getPlyrByPlid(plids[i]);
			if (!p)
				continue;

			update.push(plyrCompact(p));
		}

		io.sockets.in(this.id).emit('plyrsupdate', update);
	});

	this.on('IS_MSO', function(pkt)
	{
		// system or user msgs only
		if (pkt.usertype <= this.insim.MSO_USER)
		{
			var line = {
				'plid': pkt.plid,
				'usertype': pkt.usertype,
				'msg': pkt.msg.substr(pkt.msg.textstart)
			};
			io.sockets.in(this.id).emit('chat', line);
		}
	});
}
