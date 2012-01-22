var livemap = {};
var runonce = false;

// setup express and socket.io
var express = require('express').createServer(),
	io = require('socket.io').listen(express);

var util = require('util');

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

	// setup express
	if (!runonce)
	{
		runonce = true;

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

					if (livemap[map])
					{
						for(var i in livemap[map].plyrs)
							socket.emit('IS_NPL', livemap[map].plyrs[i]);
					}
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

				if (livemap[map])
				{
					for(var i in livemap[map].plyrs)
						socket.emit('IS_NPL', livemap[map].plyrs[i]);
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

	// setup our state storage
	livemap[this.client.id] = {
		host: 0,
		hostname: '',
		track: '',
		plyrs: {}
	};

	// now we can start registering hooks

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

		// request players
		var p = new this.insim.IS_TINY();
		p.reqi = 1;
		p.subt = this.insim.TINY_NPL;
	
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
		this.log.crit(util.inspect(pkt));
		this.log.crit(util.inspect(livemap[this.client.id].track));
		if (pkt.track != livemap[this.client.id])
		{
			this.log.crit('sending maps update');
			livemap[this.client.id].track = pkt.track;

			io.sockets.emit('maps', xlate());
		}
	});

	this.client.registerHook('IS_MCI', function(pkt)
	{
		io.sockets.in(this.client.id).emit('IS_MCI', pkt.compcar);
	});

	this.client.registerHook('IS_MSO', function(pkt)
	{
		// system or user msgs only
		if (pkt.usertype <= this.insim.MSO_USER)
			io.sockets.in(this.client.id).emit('IS_MSO', pkt);
	});

	this.client.registerHook('IS_NPL', function(pkt)
	{
		livemap[this.client.id].plyrs[pkt.plid] = pkt;

		io.sockets.in(this.client.id).emit('IS_NPL', pkt);
	});

	this.client.registerHook('IS_PLL', function(pkt)
	{
		livemap[this.client.id].plyrs[pkt.plid] = undefined;

		io.sockets.in(this.client.id).emit('IS_PLL', pkt.plid);
	});

	this.client.registerHook('IS_PLP', function(pkt)
	{
		livemap[this.client.id].plyrs[pkt.plid] = undefined;

		io.sockets.in(this.client.id).emit('IS_PLP', pkt.plid);
	});
}
