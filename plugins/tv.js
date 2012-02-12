"use strict";

var util = require('util'),
	fs = require('fs'),
	path = require('path'),
	kd = require('kdtree.js');

/*
 * Only supports a single insim connection.
 * Assigning multiple insim connections will yield unexpected behaviour.
 */

/*
Things that make racing interesting -
fastest lap
close racing
  * overtaking
  * PBs
  * faster cars coming up through the field
pitting
  * leaving pits
  * pitting
accidents
  * off track
  * sudden deceleration
  * sudden change in direction
  * airbourne
 */

// weighted scoring for each car
var weightCars = {
	'UF1': 0,
	'XFG': 5,
	'XRG': 5,
	'XRT': 10,
	'RB4': 10,
	'FXO': 10,
	'LX4': 10,
	'LX6': 15,
	'MRT': 15,
	'FZ5': 15,
	'XFR': 20,
	'UFR': 18,
	'FOX': 20,
	'FO8': 25,
	'BF1': 45,
	'FXR': 30,
	'XRR': 30,
	'FZR': 30
};
			
var tvDirector = function()
{
	var self = this;

	// an array of plyrs, and their score
	self.plyrs = [];
	self.timers = {
		'hunt': null,
		'back': null
	};

	self.logger = null;
	self.client = null;
	self.insim = null;
	self.history = {
		'current': null,
		'previous': null,
	};

	// split the track into X by X grid, where X*65536
	// a meter in LFS is 65536, so we want it not unreasonably wide
	self.gridsize = 25*65536;

	// prevent rapid changes
	self.cooldown = 5000;
	self.huntcooldown = 15000;

	self.init = function()
	{
		this.client.isiFlags |= this.insim.ISF_MCI | this.insim.ISF_CON | this.insim.ISF_HLV | this.insim.ISF_LOCAL;

		this.log.info('Registering TV');

		self.logger = this.log;
		self.client = this.client;
		self.insim = this.insim;

		self.track = null;

		// fire a change every 10 seconds, if not called sooner
		self.timers.hunt = setInterval(self.hunt, self.huntcooldown);

		//this.client.on('state:best', self.onFastest);
		this.client.on('state:track', self.onTrack);
		/*
		this.client.on('state:race', self.onStart);
		this.client.on('IS_PLA', self.onPitLane);
		this.client.on('IS_CON', self.onContact);
		this.client.on('IS_FLG', self.onFlag);
		this.client.on('IS_HLV', self.onInvalidLap);
		this.client.on('IS_FIN', self.onFinish);
		this.client.on('IS_RES', self.onFinalStanding);
		*/
	}
	
	self.term = function()
	{
		if (self.timer)
			clearTimeout(self.timer);
	}

	self.log = function(text)
	{
		if (!self.logger)
			return;

		self.logger.info('TV:' + text);
	}

	self.onFastest = function()
	{
		var plid = this.client.state.best.plid;

		if (plid <= 0)
			return;

		self.log('New fastest');
		self.change(plid);
	}

	self.onTrack = function()
	{
		var track = this.client.state.track;
		if (this.client.state.lname.length > 0)
			track = this.client.state.lname;

		self.track = new kd.KDTree(3);

		console.log('loading pth %s', track);

		var pth = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/pth', track + '.json'), 'utf8'));

		console.log('translating');
		var translated = [];
		for (var i in pth.nodes)
			translated.push([pth.nodes[i].x, pth.nodes[i].y, pth.nodes[i].z]);

		var start = new Date().getTime();
		console.log('building');
		self.track.build(translated);
		var end = new Date().getTime();
		console.log('building done in %d seconds', (end - start)/1000);

		self.hunt();
	}

	self.onPitLane = function(pkt)
	{
		if (self.isCurrent(pkt.plid))
			return;

		if (pkt.fact == self.insim.PITLANE_DT)
		{
			self.log('Serving drive through');
			self.changeAndReturn(pkt.plid);
			return;
		}

		if (pkt.fact == self.insim.PITLANE_SG)
		{
			self.log('Serving stop and Go');
			self.changeAndReturn(pkt.plid);
			return;
		}
	}

	self.onContact = function(pkt)
	{
		if (self.isCurrent(pkt.a.plid) || self.isCurrent(pkt.b.plid))
			return;

		var plid = pkt.a.plid;
		// focus on whoever most likely the cause
		// TODO this is a bit simple	
		if (pkt.b.speed > pkt.a.speed)
			plid = pkt.b.plid;

		var plyra = this.client.state.getPlyrByPlid(pkt.a.plid);
		var plyrb = this.client.state.getPlyrByPlid(pkt.b.plid);
		self.log('New contact - between' + plyra.pname + ' and ' + plyrb.pname);
		self.change(plid);
	}

	self.onFlag = function(pkt)
	{
		if (self.isCurrent(pkt.plid))
			return;

		if (!pkt.offon)
			return;

		switch(pkt.flag)
		{
			case self.insim.FLG_BLUE:
				self.log('Blue flag, going to overtaker');
				self.change(pkt.carbehind);
				break;
			case self.insim.FLG_YELLOW:
				self.log('Yellow flag, going to victim');
				self.changeAndReturn(pkt.plid);
				break;
		}
	}

	self.onInvalidLap = function(pkt)
	{
		if (self.isCurrent(pkt.plid))
			return;

		switch(pkt.hlvc)
		{
			case self.insim.HLVC_SPEED:
				self.log('HLVC:Speeding');
				self.change(pkt.plid);
				return;
				break;
			case self.insim.HLVC_WALL:
				self.log('HLVC:Wall');
				self.change(pkt.plid);
				return;
				break;
			case self.insim.HLVC_GROUND:
			default:
				return;
				break;
		}
	}

	self.onStart = function()
	{
		var i = 0;
		var plyrs = self.client.state.plyrs;

		while (i < plyrs.length)
		{
			if (plyrs[i].position == 1)
				break;
			i++;
		}
	
		self.change(i, false); // force switch to the pole position
	}

	self.onFinish = function(pkt)
	{
		var plyr = this.client.state.getPlyrByPlid(pkt.plid);

		if (plyr.position == 1)
		{
			self.log('WINNER');
			self.change(pkt.plid, false); // force chance to winner
		}
	}

	self.onFinalStanding = function(pkt)
	{
		// we only care about our winner
		if (pkt.resultnum != 0)
			return;

		self.change(pkt.plid, false); // force chance to winner
	}

	self.updateLast = function()
	{
		self.last = new Date().getTime();
	}

	self.shouldChange = function(cooldown)
	{
		cooldown = cooldown || self.cooldown;
		return (((new Date().getTime()) - self.last) > cooldown);
	}

	self.isCurrent = function(plid)
	{
		return (self.history.current == plid);
	}

	self.change = function(plid, check, back)
	{
		if (self.isCurrent(plid))
			return;

		if (check == undefined)
			check = true;

		back = back || false;

		if (check && !self.shouldChange())
			return;

		if (!self.insim || !self.client)
			return;

		var who = 'unknown player';
		var plyr = self.client.state.getPlyrByPlid(plid);
		if (plyr)
			who = plyr.pname;

		self.log('Switching to ' + who);

		self.history.previous = self.history.current;
		self.history.current = plid;

		var pkt = new self.insim.IS_SCC;
		pkt.viewplid = plid;
		self.client.send(pkt);

		if (back)
		{
			var prev = self.history.previous;
			if (self.timers.back)
				clearTimeout(self.timers.back);

			self.timers.back = setTimeout(function()
			{
				self.log('Switching back');
				self.change(prev);
				self.timers.back = null;
			}, self.cooldown);
		}

		self.updateLast();
	}

	self.changeAndReturn = function(plid)
	{
		self.change(plid, undefined, true);
	}

	self.hunt = function()
	{
		self.log('hunt called');

		// hunt for interesting things
		//if (!self.shouldChange(self.huntcooldown))
		//	return;

		self.log('Hunting');

		var grid = {};
		var plyrs = self.client.state.plyrs;

		for (var i in plyrs)
		{
			console.log("plyr %s (%d) x=%d,y=%d,z=%d", plyrs[i].pname, i, plyrs[i].x, plyrs[i].y, plyrs[i].z);
			var nearest = self.track.nearest([ plyrs[i].x, plyrs[i].y, plyrs[i].z ], 1);
			if (!nearest || nearest.length <= 0)
				continue;

			if (!grid[nearest[0].node.genId()])
				grid[nearest[0].node.genId()] = [];

			grid[nearest[0].node.genId()].push(plyrs[i].plid);
		}

		var maxId = null;
		var maxV = 0;
		for (var i in grid)
		{
			if (grid[i].length > maxV)
				maxId = i;
		}

		console.log('most interesting node is ' + maxId + ' with plyrs ' + grid[maxId]);

	}

	//self.updateLast();
};

var director = new tvDirector;

exports.init = director.init;
exports.term = director.term;
