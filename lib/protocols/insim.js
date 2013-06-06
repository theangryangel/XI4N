var util = require('util'),
	_ = require('underscore'),
	base = require('./base'),
	insim = require('../decoders/insim'),
	outgauge = require('../decoders/outgauge'),
	outsim = require('../decoders/outsim'),
	tcp = require('./tcp'),
	udp = require('./udp');

var client = function(options, log)
{
	var self = this;

	this.defaults = {
		protocol: 'tcp',
		host: '127.0.0.1',
		port: 29999,
		udpport: -1,
		admin: '',
		prefix: '',
		isiflags: 0
	};

	base.call(this, options, log);

	this.connections = [];

	this.decoders = [
		outgauge,
		outsim,
		insim
	];

	this.insim = insim;
	this.outsim = outsim;
	this.outgauge = outgauge;

	var pri = new tcp(this.options.port, this.options.host);
	if (this.options.protocol == 'udp')
		pri = new udp(this.options.port, this.options.host);

	this.connections.push(pri);

	if (this.options.protocol != 'udp' && this.options.udpport > 0)
		this.connections.push(new udp(this.options.udpport, this.options.host));

	// only the primary connection in InSim counts. 
	// the secoundary is only used when udport is set, and thus we don't
	// actually send anything over it.
	this.connections[0].on('connect', function()
	{
		// send ISI & bubble up
		var p = new insim.IS_ISI;
		p.iname = self.product.name;
		p.flags = self.options.isiflags;
		p.interval = 1000;
		p.reqi = 1; // request the InSim version from host

		if (self.options.admin.length > 0)
			p.admin = self.options.admin;

		if (self.options.prefix.length == 1)
			p.prefix = self.options.prefix.charCodeAt(0);

		if (self.options.udpport > 0)
			p.udpport = self.options.udpport;

		self.send(p);
		self.emit('connect');
	});

	this.connections[0].on('disconnect', function()
	{
		// bubble up
		var p = new insim.IS_TINY;
		p.subt = insim.TINY_CLOSE;
		self.send(p);

		self.emit('disconnect');
	});

	for(var i in this.connections)
		this.connections[i].on('packet', _.bind(this.receive, this));

	// keepalive - maintain the connection by responding to ping-pongs
	// removed from being a plugin, because why should the user need to know
	// that they need to configure a REQUIRED plugin?!
	this.on('IS_TINY', this.onIS_TINY);

	// version checking
	this.on('IS_VER', this.onIS_VER);
}

util.inherits(client, base);

client.prototype.connect = function()
{
	for (var i in this.connections)
		this.connections[i].connect();
}

client.prototype.disconnect = function()
{
	// send IS_CLOSE
	var p = new insim.IS_TINY;
	p.subt = insim.TINY_CLOSE;
	this.send(p);

	for (var i in this.connections)
		this.connections[i].disconnect();
}

client.prototype.send = function(data)
{
	if (this.connections[0])
		this.connections[0].send(data.pack());
}

client.prototype.onIS_TINY = function(pkt)
{
	if (pkt.subt != this.insim.TINY_NONE)
		return;

	this.log.info('PING? PONG!');

	var p = new this.insim.IS_TINY();
	p.subt = this.insim.TINY_NONE;

	this.send(p);
}

client.prototype.onIS_VER = function(pkt)
{
	this.log.info('Got IS_VER');

	if (pkt.insimver != this.insim.VERSION)
		this.log.warn('Reported InSim Version from LFS does not match our library supported version. May result in undesirable behaviour!');
}

module.exports = client;
