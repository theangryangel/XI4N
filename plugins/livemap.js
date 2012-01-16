var livemap = {};

var xlate = function()
{
	var maps = {};
	for (var i in livemap)
		maps[i] = { 'hostname': livemap[i].hostname, 'track': livemap[i].track };
	return maps;
}

exports.init = function(options)
{
	var self = this;

	this.client.isiFlags |= this.insim.ISF_MCI;

	this.log.info('Registering LiveMap plugin');

	livemap[this.client.id] = {
		host: 0,
		hostname: '',
		track: ''
	};

	this.client.registerHook('connect', function()
	{
		// request what server we're on
		var p = new this.insim.IS_TINY();
		p.reqi = 1;
		p.subt = this.insim.TINY_ISM;
	
		this.client.send(p);

		// request state
		var p = new this.insim.IS_TINY();
		p.reqi = 1;
		p.subt = this.insim.TINY_SST;
	
		this.client.send(p);	
	});
	
	this.client.registerHook('IS_ISM', function(pkt)
	{
		livemap[this.client.id].hostname = pkt.hname;
		livemap[this.client.id].host = pkt.host;

		io.sockets.emit('maps', xlate());
	});

	this.client.registerHook('IS_STA', function(pkt)
	{
		if ((pkt.track.length > 0) && (pkt.track != livemap.track))
		{
			livemap[this.client.id].track = pkt.track;

			io.sockets.emit('maps', xlate());
		}
	});

	this.client.registerHook('IS_MCI', function(pkt)
	{
		io.sockets.in(this.client.id).emit('IS_MCI', pkt.compcar);
	});

	this.client.registerHook('IS_PLL', function(pkt)
	{
		io.sockets.in(this.client.id).emit('IS_PLL', pkt.plid);
	});

	// setup express and socket.io
	var express = require('express').createServer(),
		io = require('socket.io').listen(express);

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
	express.set('views', __dirname + '/livemap/views');
	
	// listen on the default port
	express.listen(options['http-port'] || 8080);

	// setup /static to map to ./livemap/static
	express.use('/static', require('express').static(__dirname + '/livemap/static'));

	// render index.html as /
	express.get('/', function (req, res)
	{
		res.render('index.html', { port: options['http-port'] || 8080 });
	});

	// on connection, send the list of insim client connections
	// and hook up all our callbacks
	io.sockets.on('connection', function(socket)
	{
		io.sockets.emit('maps', xlate());

		socket.on('join', function(map)
		{
			if ((map) && (map.length > 0))
			{
				socket.join(map);
				socket.map = map;
			}
		});

		socket.on('switch', function(map)
		{
			if (socket.map)
				socket.leave(socket.map);

			if ((map) && (map.length > 0))
			{
				socket.join(map);
				socket.map = map;
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
