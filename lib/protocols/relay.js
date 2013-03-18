var util = require('util'),
	_ = require('underscore'),
	base = require('./base'),
	insim = require('../decoders/insim'),
	relay = require('../decoders/relay'),
	tcp = require('./tcp'),
	udp = require('./udp');

var client = function(options, log)
{
	var self = this;
	base.call(this, options, log);

	this.options = _.defaults(options, {
		host: '',
		admin: '',
		spec: ''
	});

	this.connection = null;

	this.decoders = [
		insim,
		relay,
	];

	this.relay = relay;
	this.insim = insim;

	this.connection = new tcp(47474, 'isrelay.lfs.net');

	// only the primary connection in InSim counts. 
	// the secoundary is only used when udport is set, and thus we don't
	// actually send anything over it.
	this.connection.on('connect', function()
	{
		// send IR_SEL
		if (self.options.host.length > 0)
			self.select(self.options.host, self.options.admin, self.options.spec);

		self.emit('connect');
	});

	this.connection.on('disconnect', function()
	{
		self.emit('disconnect');
	});

	this.connection.on('packet', _.bind(this.receive, this));

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
	this.connection.connect();
}

client.prototype.select = function(host, admin, spec)
{
	if (!host || host.length < 1)
		throw new Error('Can\'t select a blank host!');

	// send IR_SEL
	var p = new relay.IR_SEL;
	p.hname = host;
	p.admin = admin || '';
	p.spec = spec || '';

	this.send(p);
}

client.prototype.disconnect = function()
{
	// send IS_CLOSE
	var p = new insim.IS_TINY;
	p.subt = insim.TINY_CLOSE;
	this.send(p);

	this.connection.disconnect();
}

client.prototype.send = function(data)
{
	this.connection.send(data.pack());
}

client.prototype.onIS_TINY = function(pkt)
{
	if (pkt.subt != this.insim.TINY_NONE)
		return;

	var p = new this.insim.IS_TINY();
	p.subt = this.insim.TINY_NONE;

	this.send(p);
}

client.prototype.onIS_VER = function(pkt)
{
	if (pkt.insimver != this.insim.VERSION)
		this.log.warn('Reported InSim Version from LFS does not match our library supported version. May result in undesirable behaviour!');

	this.emit('connect');
}

module.exports = client;
