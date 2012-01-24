"use strict";

var conn = function(pkt)
{
	var self = this;

	// setup, from IS_NCN
	for (var i in pkt.getProperties())
	{
		if (self.hasOwnProperty(i))
			self[i] = pkt[i];
	}
}

conn.prototype = {
	'ucid': 0,
	'admin': false,
	'uname': '',
	'flags': 0,

	'plid': 0
};

var plyr = function(pkt)
{
	var self = this;

	// setup from IS_NPL
	for (var i in pkt.getProperties())
	{
		if (self.hasOwnProperty(i))
			self[i] = pkt[i];
	}
}

plyr.prototype = {
	'plid': 0,

	'ucid': 0,
	'ptype': 0,
	'flags': 0,

	'pname': '',
	'plate': '',
	'cname': '',
	'sname': '',
	'tyres': 0,
	
	'h_mass': 0,
	'h_tres': 0,
	'model': 0,
	'pass': 0,
	'setf': 0
};

var state = function() {}
state.prototype = {
	'version': '', // lfs version
	'product': '', // lfs product name (Demo, S1, S2)
	'insimver': 5, // insim version

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

	// helper functions
	'getPlyrByPlid': function()
	{
	},
	'getPlyrByUcid': function()
	{
	},
	'getConnByUcid': function()
	{
	},
	'getConnByPlid': function()
	{
	},

	// insim/product version
	'onIS_VER': function(pkt)
	{
		var self = this;

		self.version = pkt.version;
		self.product = pkt.product;
		self.insimver = pkt.insimver;
	},

	// game state

	// connection specific hooks
	'onIS_NCN': function(pkt)
	{
		var self = this;

		// new connection
		var c = new conn(pkt);
		self.conns[c.ucid] = c;

	},
	'onIS_CNL': function(pkt)
	{
		var self = this;

		// connection leaves
		if ((self.conns[pkt.ucid]) && (self.conns[pkt.ucid].plid > 0))
			self.plyrs[self.conns[pkt.ucid].plid] = undefined;

		self.conns[pkt.ucid] = undefined;
	},
	'onIS_CPR': function(pkt)
	{
		var self = this;

		// connection rename
		if (!self.conns[pkt.ucid])
			return;

		self.conns[pkt.ucid].pname = pkt.pname;
		self.conns[pkt.ucid].plate = pkt.plate;
	},

	// player specific hooks
	'onIS_NPL': function(pkt)
	{
		var self = this;

		// new plyr
		var c = new plyr(pkt);
		self.plyr[c.plid] = c;
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

	// hooks, helper array
	'hooks': {
		'ISP_NCN': 'onIS_NCN',
		'ISP_CNL': 'onIS_CNL',
		'ISP_CPR': 'onIS_CPR',

		'ISP_NPL': 'onIS_NPL',
		'ISP_PLP': 'onIS_PLP',
		'ISP_TOC': 'onIS_TOC',
		'ISP_FIN': 'onIS_FIN',
		'ISP_RES': 'onIS_RES',
	},

	// hook helpers
	'registerHooks': function(client)
	{
		var self = this;

		// register all hooks
		for (var i in self.hooks)
			client.registerHook(i, self[self.hooks[i]]);
	},
	'unregisterHooks': function(client)
	{
		var self = this;

		// unregister all hooks
		for (var i in self.hooks)
			client.unregisterHook(i, self[self.hooks[i]]);
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
