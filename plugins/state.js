"use strict";

var conn = function(pkt)
{
	// setup, from IS_NCN
}

conn.prototype = {
	'id': 0,
	'admin': false,
	'username': '',
	'flags': 0,

	'plid': 0
};

var plyr = function(pkt)
{
	// setup from IS_NPL
}

plyr.prototype = {
	'id': 0,
	'ucid': 0,
	
	'ptype': 0,
	'flags': 0,
	'name': '',
	'model': '',
	'skin': '',
	'vehicle': '',
	'tyres': 0,
	'intake': 0,
	'passengers': 0,
	'setup': 0
};

var state = function() {}
state.prototype = {
	'version': 0, // lfs version
	'product': '', // lfs product name (Demo, S1, S2)
	'insim': 5, // insim version

	'flags': 0, // state flags

	'replayspeed': 1, // replay speed

	'raceinprogress': false,
	'qualmins': 0, // number of qualifying mins
	'laps': 0, // laps

	'track': '', // short trackname
	'weather': '', // 0-2
	'wind': '', // 0-2, none-weak-strong

	'conns': [],
	'plyrs': [],

	// connection specific hooks
	'onIS_NCN': function(pkt)
	{
		// new connection
	},
	'onIS_CNL': function(pkt)
	{
		// connection leaves
	},
	'onIS_CPR': function(pkt)
	{
		// connection leaves
	},

	// player specific hooks
	'onIS_NPL': function(pkt)
	{
		// new player
	},
	'onIS_PLP': function(pkt)
	{
		// player pits
	},
	'onIS_PLL': function(pkt)
	{
		// player leaves
	},
	'onIS_TOC': function(pkt)
	{
		// player takes over vehicle (connection->player swapping)
	},
	'onIS_FIN': function(pkt)
	{
		// player finishes
	},
	'onIS_RES': function(pkt)
	{
		// player finish result
	},

	'hooks': {
		
	},

	// hook helpers
	'registerHooks': function(client)
	{
		// register all hooks
		for (var i in this.hooks)
			client.registerHook(i, this.hooks[i]);
	},
	'unregisterHooks': function(client)
	{
		// unregister all hooks
		for (var i in this.hooks)
			client.unregisterHook(i, this.hooks[i]);
	}
};

exports.init = function(options)
{
	this.log.info('Registering state plugin');

	this.client.registerHook('connect', function()
	{
		// setup state
		this.client.state = new state;

		// setup hooks
		this.client.state.registerHooks(this.client);
	});

	this.client.registerHook('disconnect', function()
	{
		// clear hooks
		this.client.state.unregisterHooks(this.client);

		// clear any known state
		this.client.state = undefined;
	});
}
