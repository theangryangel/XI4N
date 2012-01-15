var stats = {};

exports.init = function(options)
{
	var self = this;

	this.client.isiFlags |= this.insim.ISF_MCI;

	this.log.info('Registering LiveMap plugin');

	stats[this.client.id] = {
		hid: this.client.id, /* host id, either assigned in config.json or auto calculated */
		host: 0,
		hostname: '',
		track: ''
	};
	
	this.client.registerHook('IS_ISM', function(pkt)
	{
		stats[this.client.id].hostname = pkt.hname;
		stats[this.client.id].host = pkt.host;

		io.sockets.emit('clients', stats);
	});

	this.client.registerHook('IS_STA', function(pkt)
	{
		if ((pkt.track.length > 0) && (pkt.track != stats.track))
		{
			stats[this.client.id].track = pkt.track;
			io.sockets.emit('clients', stats);
		}
	});

	this.client.registerHook('IS_VER', function()
	{
		var p = new this.insim.IS_TINY();
		p.reqi = 1;
		p.subt = this.insim.TINY_ISM;
	
		this.client.send(p);

		var p = new this.insim.IS_TINY();
		p.reqi = 1;
		p.subt = this.insim.TINY_SST;
	
		this.client.send(p);	
	});

	this.client.registerHook('IS_MCI', function(pkt)
	{
		io.sockets.emit('IS_MCI', { hid: this.client.id, compcar: pkt.compcar });
	});

	// setup express and socket.io
	var express = require('express').createServer(),
		io = require('socket.io').listen(express);

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
	io.sockets.on('connection', function (socket)
	{
		socket.emit('clients', stats);
	});
}
