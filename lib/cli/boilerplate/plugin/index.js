'use strict';

var plugin = function(options)
{
	this.options = options;
}

plugin.prototype.associate = function(client)
{
	// a reference to the plugin's scope
	var self = this;

	// setup your event listeners here.
	// your plugin can be associated with multiple client instances, so be aware
	// of this
	//
	// each client can be identified by client.id
	// however, unless explicitly set in the config, the id is a randomly
	// generated id and is not persistent between reloads
	//
	// consult InSim.txt for a complete list of events
	
	// will fire on connection of client
	// event scope is set to the client's scope.
	// If you need to reference plugin, you should use self.
	client.on('connect', function()
	{
		this.log.info('Hello world!');
	});

	// this callback will fire when a IS_RST is received
	client.on('IS_RST', function(pkt)
	{
		this.log.info('New restart packet received!');

		// create a new instance of IS_MST
		// MSg Type - send to LFS to type message or command
		var p = new this.insim.IS_MST;
		p.msg = 'New restart packet received!';

		// send a IS_MST to the client that received the IS_RST
		this.send(p);
	});
}

module.exports = plugin;
