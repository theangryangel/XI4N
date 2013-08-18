'use strict';

var plugin = function(options)
{
	events.EventEmitter.call(this);

	this.options = options;

	// 
	this.buttons = [];
}

plugin.prototype.associate = function(client)
{
	// a reference to the plugin's scope
	var self = this;

	// setup click id reference
	self.buttons[client.id] = [];

	// when new connection, create new click id reference
	client.on('IS_NCN', function(pkt)
	{
		self.safetyDance(this.id, pkt.ucid);
	});

	// when leaving connection, remove click id references
	client.on('IS_CNL', function(pkt)
	{
		if (!self.buttons[this.id][pkt.ucid])
			return;

		delete self.buttons[this.id][pkt.ucid];
	});

	// expose the api to everyone else!
	client.buttons = self;
}

plugin.prototype.send(client, ucid, inst, bstyle, typein, l, t, w, h, text, callback)
{
	var clickid = this.getClickId(client, ucid);
	this.buttons[client.id][ucid][clickid] = callback;

	return clickid;
}

plugin.prototype.clear = function(client, ucid, clickid)
{
	if (!clickid)
}

plugin.prototype.getClickId = function(client, ucid)
{
	this.safetyDance();

	var  i = 0;

	for(i in this.buttons[client.id][ucid])
	{
		if (!this.buttons[click.id][ucid][i])
			break;
	}

	if (i > 239)
		throw new Error('Max buttons reached');

	return i;
}

plugin.prototype.safetyDance = function(client, ucid)
{
	if (!this.buttons[client.id])
		this.buttons[client.id] = [];

	if (!this.buttons[client.id][ucid])
		this.buttons[client.id][ucid] = [];
}

module.exports = plugin;
