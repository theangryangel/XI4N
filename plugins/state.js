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

var StateBase = function() {
	console.log('state base');
};

StateBase.prototype = {
	'fromPkt': function(pkt)
	{
		for (var i in pkt)
		{
			if ((typeof pkt[i] != 'function') && (self[i]))
				this[i] = pkt[i];
		}
	}
};

var ConnState = function(pkt)
{
	var self = this;

	console.log('creating connstate');

	self.ucid = 0;
	self.admin = false;
	self.uname = '';
	self.flags = 0;

	self.plid = 0;

	// setup, from IS_NCN


	console.log(this);
}

utils.inherits(ConnState, StateBase);

var PlyrState = function(pkt)
{
//	console.log('creating plyrstate');
	var self = this;

	self.plid = 0;

	self.ucid = 0;
	self.ptype = 0;
	self.flags = 0;

	self.pname = '';
	self.plate = '';
	self.cname = '';
	self.sname = '';
	self.tyres = 0;
	
	self.h_mass = 0;
	self.h_tres = 0;
	self.model = 0;
	self.pass = 0;
	self.setf = 0;
	self.pitting = false; // tele-pitting

	self.node = 0;
	self.lap = 0;
	self.position = 0;
	self.info = 0;
	self.x = 0;
	self.y = 0;
	self.z = 0;
	self.speed = 0;
	self.direction = 0;
	self.heading = 0;
	self.angvel = 0;

	// setup from IS_NPL
	this.fromPkt(pkt);

//	console.log(this);
}

utils.inherits(PlyrState, StateBase);

var ClientState = function() {
	var self = this;

	self.lfs = {
		'version': '', // lfs version
		'product': '', // lfs product name (Demo, S1, S2)
		'insimver': 5 // insim version
	};

	self.host = false; // is host?
	self.hname = ''; // hostname

	self.replayspeed = 1;
	self.flags = 0; // state flags
	self.ingamecam = 0;
	self.viewplid = 0; // currently viewing this plid

	self.raceinprog = false;
	self.qualmins = 0; // number of qualifying mins
	self.racelaps = 0; // laps

	self.track = ''; // short trackname
	self.weather = ''; // 0-2
	self.wind = ''; // 0-2, none-weak-strong

	self.conns = [];
	self.plyrs = [];
};

ClientState.prototype = {
	 'lfs': {
		'version': '', // lfs version
		'product': '', // lfs product name (Demo, S1, S2)
		'insimver': 5 // insim version
	},
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

	// state ready
	'onIS_VER': function(pkt)
	{
		var self = this.client.state;

		self.lfs.version = pkt.version;
		self.lfs.product = pkt.product;
		self.lfs.insimver = pkt.insimver;

		// FIXME in a loop sending these 4 pkts breaks horribly..
		// TODO figure out why
		var t0 = new this.insim.IS_TINY();
		t0.reqi = 1;
		t0.subt = this.insim.TINY_ISM;
		this.client.send(t0);

		var t1 = new this.insim.IS_TINY();
		t1.reqi = 1;
		t1.subt = this.insim.TINY_NCN;
		this.client.send(t1);

		var t2 = new this.insim.IS_TINY();
		t2.reqi = 1;
		t2.subt = this.insim.TINY_NPL;
		this.client.send(t2);

		var t3 = new this.insim.IS_TINY();
		t3.reqi = 1;
		t3.subt = this.insim.TINY_SST;
		this.client.send(t3);
	},

	// game state
	// IS_STA or IS_RST
	'onGeneric_Copy': function(pkt)
	{
		var self = this.client.state;

		// useful function that can be used when we just need to copy
		// game state change or race start
		// we just blindly copy 
		for (var i in pkt.getProperties())
		{
			if ((typeof self[i] != 'function') && (self.hasOwnProperty(i)))
				self[i] = pkt[i];
		}
	},
	'onIS_ISM': function(pkt)
	{
		var self = this.client.state;
		//  multiplayer start/join
		
		self.host = pkt.host;
		self.hname = pkt.hname;
	},

	// connection specific hooks
	'onIS_NCN': function(pkt)
	{
		var self = this.client.state;
		// new connection

		var c = new ConnState(pkt);
		self.conns[c.ucid] = c;

		this.client.emit('STA_CONNNEW', c.ucid);
	},
	'onIS_CNL': function(pkt)
	{
		var self = this.client.state;
		// connection leaves

		if ((self.conns[pkt.ucid]) && (self.conns[pkt.ucid].plid > 0))
			self.plyrs[self.conns[pkt.ucid].plid] = undefined;

		self.conns[pkt.ucid] = undefined;

		this.client.emit('STA_CONNLEAVE', pkt.ucid);
	},
	'onIS_CPR': function(pkt)
	{
		var self = this.client.state;
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
		console.log('GOT ISNPL');
		var self = this.client.state;
		var p = null;
		
		if (!self.plyrs[pkt.plid])
		{
			// new/unknown plyr
			p = new PlyrState(pkt);

			self.plyrs[p.plid] = p;

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
		var self = this.client.state;
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
		var self = this.client.state;

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
		var self = this.client.state;

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
		var self = this.client.state;

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
		'IS_VER': 'onIS_VER',

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

	this.client.registerHook('preconnect', function()
	{
		// setup state
		this.client.state = new ClientState;

		// setup hooks
		this.client.state.registerHooks(this.client);

		this.client.emit('STA_READY');
	});

	this.client.registerHook('disconnect', function()
	{
		// we're going to be lazy and tear down the whole state on a 
		// disconnection, so we'll need to completely remove all the hooks first

		this.client.emit('STA_NOTREADY');

		// clear hooks
		this.client.state.unregisterHooks(this.client);

		// clear any known state
		this.client.state = undefined;
	});
}
