'use strict';

var util = require('util'),
	events = require('events'),
	path = require('path'),
	fs = require('fs-extra'),
	util = require('util'),
	logfactory = require('../logger/factory'),
	_ = require('underscore'),
	insim = require('./insim'),
	outsim = require('./outsim'),
	outgauge = require('./outgauge'),
	relay = require('./relay');

try
{
	require('coffee-script');
}
catch(err)
{
	console.warn('  failed to include coffee-script. coffee-script support is disabled');
}

var manager = function(options)
{
	events.EventEmitter.call(this);

	this.options = options;

	this.connections = [];
	this.plugins = {};

	this.connected = 0;

	this.initPlugins();
	this.initConnections();
}

util.inherits(manager, events.EventEmitter);

manager.prototype.initPlugins = function()
{
	for (var i in this.options.plugins)
	{
		var r = this.options.plugins[i];
		var p = null;

		if (fs.existsSync(path.join(process.cwd(), 'plugins', r.path)))
			p = require(path.join(process.cwd(), 'plugins', r.path));
		else if (fs.existsSync(path.join(__dirname, '../..', 'plugins', r.path)))
			p = require(path.join(__dirname, '../..', 'plugins', r.path));

		if (!p)
		{
			console.log('failed to load plugin!');
			continue;
		}

		console.log(r);

		if (p.construct)
			p.construct(r.options);

		this.plugins[r.alias] = p;
	}
}

manager.prototype.initConnections = function()
{
	for (var i in this.options.connections)
	{
		var r = this.options.connections[i];
		var protocol = null;
		var log = logfactory(r.log);

		switch (r.talk)
		{
			case 'relay':
				protocol = new relay(r.relay, log);
			case 'outgauge':
				protocol = new outgauge(r.outgauge, log);
				break;
			case 'outsim':
				protocol = new outsim(r.outsim, log);
				break;
			case 'insim':
			default:
				protocol = new insim(r.insim, log);
				break;
		}

		for (var j in r.use)
		{
			var n = r.use[j];

			if (!this.plugins[n])
			{
				console.warn('  unknown alias (%s), failed to load plugin', n);
				continue;
			}

			protocol.associate(this.plugins[n]);
		}


		protocol.on('connect', _.bind(function()
		{
			this.connected++;
		}, this));

		protocol.on('disconnect', _.bind(function()
		{
			this.connected--;

			// none of the clients are connected any more
			// we are drained
			if (this.connected <= 0)
				this.emit('drain');
		}, this));

		this.connections.push(protocol);
	}
}

manager.prototype.start = function()
{
	for (var i in this.connections)
		this.connections[i].connect();
}

manager.prototype.stop = function()
{
	for (var i in this.connections)
		this.connections[i].disconnect();
}

module.exports = manager;
