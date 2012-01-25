"use strict";

/**
 * state.js adds a general state management and API for other plugins
 *
 * Events that maybe subscribed to:
 *  - STA_CONNNEW: new connection, sends ucid
 *  - STA_CONNLEAVE: leaving connection, sends ucid
 *  - STA_CONNREN: connection rename, sends ucid
 *  - STA_PLYRNEW: new player, sends plid
 *  - STA_PLYRPIT: player telepits, sends plid
 *  - STA_PLYRUNPIT: player leaves pits, sends plid
 *  - STA_PLYRLEAVE: player leaves race, sends plid
 *  - STA_PLYRSWAP: 2 connections swap (player take over), sends plid
 *  - STA_PLYRUPDATE: player telepits, sends array of plids
 *
 * i.e. in your dependant plugin:
 * this.client.on('STA_CONNNEW', function(ucid)
 * {
 *     var conn = this.client.state.getConnByUcid(ucid);
 *
 *     console.log('New connection %d - %s', ucid, conn.uname);
 * });
 */

var utils = require('util'),
	events = require('events');

exports.StateBase = function() {}
exports.StateBase.prototype = {
	'fromPkt': function(pkt)
	{
		var self = this;

		for (var i in pkt.getProperties())
		{
			if ((typeof self[i] != 'function') && (self.hasOwnProperty(i)))
				self[i] = pkt[i];
		}
	}
}

exports.ConnState = function(pkt)
{
	var self = this;

	// setup, from IS_NCN
	self.fromPkt(pkt);
}

exports.ConnState.prototype = {
	'ucid': 0,
	'admin': false,
	'uname': '',
	'flags': 0,

	'plid': 0
};

utils.inherits(exports.ConnState, exports.StateBase);

exports.PlyrState = function(pkt)
{
	var self = this;

	// setup from IS_NPL
	if (pkt)
		self.fromPkt(pkt);
}

exports.PlyrState.prototype = {
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
	'setf': 0,
	'pitting': false, // tele-pitting

	'node': 0,
	'lap': 0,
	'position': 0,
	'info': 0,
	'x': 0,
	'y': 0,
	'z': 0,
	'speed': 0,
	'direction': 0,
	'heading': 0,
	'angvel': 0
};

utils.inherits(exports.PlyrState, exports.StateBase);

exports.ClientState = function() {
	var self = this;

	console.log('new state');
};

exports.ClientState.prototype = {
	'lfs': {
		'version': '', // lfs version
		'product': '', // lfs product name (Demo, S1, S2)
		'insimver': 5 // insim version
	},

	'host': false, // is host?
	'hname': '', // hostname

	'replayspeed': 1,
	'flags': 0, // state flags
	'ingamecam': 0,
	'viewplid': 0, // currently viewing this plid

	'raceinprog': false,
	'qualmins': 0, // number of qualifying mins
	'racelaps': 0, // laps

	'track': '', // short trackname
	'weather': '', // 0-2
	'wind': '', // 0-2, none-weak-strong

	'conns': [],
	'plyrs': [],

	// helper functions
	'getPlyrByPlid': function(plid)
	{
		var self = this;

		return self.plyrs[plid];
	},
	'getPlyrByUcid': function(ucid)
	{
		var self = this;

		if (!self.conns[ucid])
			return;

		return self.plyrs[self.conns[ucid].plid];
	},
	'getConnByUcid': function(ucid)
	{
		var self = this;

		return self.conns[ucid];
	},
	'getConnByPlid': function(plid)
	{
		var self = this;

		if (!self.plyrs[plid])
			return;

		return self.conns[self.plyr[plid].ucid];
	},

	// insim/product version
	'onIS_VER': function(pkt)
	{
		var self = this;

		self.lfs.version = pkt.version;
		self.lfs.product = pkt.product;
		self.lfs.insimver = pkt.insimver;

		// we're connected by this point so we need to request current state, 
		// etc.
		var subt = [
			this.insim.TINY_ISM, // multiplayer?
			this.insim.TINY_NCN, // conns
			this.insim.TINY_NPL, // plyrs
			this.insim.TINY_SST  // STA
		];

		for (var i in subt)
		{
			var p = new this.insim.IS_TINY();
			p.reqi = 1;
			p.subt = i;

			this.client.send(p);
		}
	},

	// game state
	// IS_STA or IS_RST
	'onGeneric_Copy': function(pkt)
	{
		var self = this;

		// useful function that can be used when we just need to copy
		// game state change or race start
		// we just blindly copy 
		for (var i in pkt.getProperties())
		{
			if ((typeof self[i] != 'function') && (self.hasOwnProperty(i)))
				self[i] = pkt[i];
		}
	},
	'onIS_ISM': function()
	{
		var self = this;
		//  multiplayer start/join
		
		self.host = pkt.host;
		self.hname = pkt.hname;
	},

	// connection specific hooks
	'onIS_NCN': function(pkt)
	{
		var self = this;
		// new connection

		var c = new Conn(pkt);
		self.conns[c.ucid] = c;

		this.client.emit('STA_CONNNEW', c.ucid);
	},
	'onIS_CNL': function(pkt)
	{
		var self = this;
		// connection leaves

		if ((self.conns[pkt.ucid]) && (self.conns[pkt.ucid].plid > 0))
			self.plyrs[self.conns[pkt.ucid].plid] = undefined;

		self.conns[pkt.ucid] = undefined;

		this.client.emit('STA_CONNLEAVE', pkt.ucid);
	},
	'onIS_CPR': function(pkt)
	{
		var self = this;
		// connection rename

		if (!self.conns[pkt.ucid])
			return;

		self.conns[pkt.ucid].pname = pkt.pname;
		self.conns[pkt.ucid].plate = pkt.plate;

		this.client.emit('STA_CONNREN', pkt.ucid);
	},

	// player specific hooks
	'onIS_NPL': function(pkt)
	{
		var self = this;
		var p = null;
		
		if (!self.plyrs[pkt.plid])
		{
			// new/unknown plyr
			p = new Plyr(pkt);
			self.plyrs[c.plid] = c;

			// send new plyr
			this.client.emit('STA_PLYRNEW', pkt.plid);
			return;
		}

		// existing, un-pitting plyr, update our info
		p = self.plyrs[pkt.plid];
		p.fromPkt(pkt);
		p.pitting = false;

		// send plyrupdate
		this.client.emit('STA_PLYRUNPIT', [ pkt.plid ]);
	},
	'onIS_PLP': function(pkt)
	{
		var self = this;
		// player tele-pits

		if (!self.plyrs[pkt.plid])
			return;

		var p = self.plyrs[pkt.plid];
		p.pitting = true;

		p = undefined;

		// emit our custom event
		this.client.emit('STA_PLYRPIT', plid);
	},
	'onIS_PLL': function(pkt)
	{
		var self = this;

		// player leaves
		if (!self.plyrs[pkt.plid])
			return; // out of sync
		
		var ucid = self.plyrs[pkt.plid].ucid;
		self.plyrs[pkt.plid] = undefined;

		if ((ucid > 0) && (self.conns[ucid]))
			self.conns[ucid] = undefined; // out of sync if this doesn't happen

		ucid = undefined;

		this.client.emit('STA_PLYRLEAVE', plid);
	},
	'onIS_TOC': function(pkt)
	{
		var self = this;

		// player takes over vehicle (connection->player swapping)
		if ((!self.plyrs[pkt.plid]) || (self.plyrs[pkt.plid].ucid != pkt.olducid))
			return; // out of sync - TODO put in something to fix this up

		self.plyrs[pkt.plid].ucid = pkt.newucid;
		self.conns[pkt.newucid].plid = pkt.plid;

		this.client.emit('STA_PLYRSWAP', plid);
	},
	'onIS_FIN': function(pkt)
	{
		// player finishes
	},
	'onIS_RES': function(pkt)
	{
		// player finish result
	},
	'onIS_MCI': function(pkt)
	{
		var self = this;

		var updated = [];

		//  positioning update
		for(var i in data)
		{
			if (!self.plyrs[pkt.plid])
				continue;

			self.plyrs[pkt.plid].fromPkt(pkt);

			updated.push(pkt.plid);
		}

		// emit our custom event
		this.client.emit('STA_PLYRUPDATE', updated);
	},

	// hooks, helper array
	'hooks': {
		'IS_STA': 'onGeneric_Copy',
		'IS_RST': 'onGeneric_Copy',
		'IS_ISM': 'onIS_ISM',

		'IS_NCN': 'onIS_NCN',
		'IS_CNL': 'onIS_CNL',
		'IS_CPR': 'onIS_CPR',

		'IS_NPL': 'onIS_NPL',
		'IS_PLP': 'onIS_PLP',
		'IS_TOC': 'onIS_TOC',
		'IS_FIN': 'onIS_FIN',
		'IS_RES': 'onIS_RES',
		'IS_MCI': 'onIS_MCI',
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
		this.client.state = new exports.ClientState;

		var state = new exports.PlyrState();

		console.log(utils.inspect(state));

		// setup hooks
		this.client.state.registerHooks(this.client);

		console.log(this.client.state);

		this.client.emit('STA_READY');
	});

	this.client.registerHook('disconnect', function()
	{
		// we're going to be lazy and tear down the whole state on a 
		// disconnection, so we'll need to completely remove all the hooks first

		// clear hooks
		this.client.state.unregisterHooks(this.client);

		// clear any known state
		this.client.state = undefined;
	});
}
