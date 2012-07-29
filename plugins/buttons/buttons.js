"use strict";

/**
 * button manager
 */

var ButtonsState = function(client)
{
	// reference to client instance
	this.client = client;

	// sparse array of arrays organised by 
	//  this.buttons[ucid][clickId]
	this.buttons = [];

	// max clickId
	this.MAX_ID = 239;
}

ButtonsState.prototype = {
	'getBtnStack': function(ucid)
	{
		if (!this.buttons[ucid])
		{
			this.buttons[ucid] = [];
			this.buttons[ucid].length = this.MAX_ID;
		}

		return this.buttons[ucid];
	},
	'getNextClickId': function(ucid)
	{
		var state = this.getBtnStack(ucid);

		if (!state)
			return null;

		for (var i = 0; i < state.length && i <= this.MAX_ID; i++)
		{
			var b = this.state[i];

			if (b == null || b == undefined)
				return i;
		}

		return null;
	},
	'hooks': {
		'IS_BTC': 'onIS_BTCorBTT',
		'IS_BTT': 'onIS_BTCorBTT',
		'state:connnew': 'onStateConnNew',
		'state:connleave': 'onStateConnLeave'
	},
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
	},
	'add': function(btn, callback)
	{
		var clickId = this.getNextClickId();
		if (!clickId)
			return;

		var cb = callback || null;

		var state = this.getBtnStack(btn.ucid);
		state[clickId] = callback || null;

		btn.clickid = clickId;
		this.client.send(btn);

		return clickId;
	},
	'remove': function(ucid, clickId)
	{
		// send IS_BFN
		delete this.buttons[ucid][clickId];

		var p = new this.client.insim.IS_BFN;
		p.subt = this.client.insim.BFN_CLEAR;

		if (clickId > 0)
		{
			p.subt = this.client.insim.BFN_DEL_BTN;
			p.clickid = clickId;
		}

		this.client.send(p);
	},
	'onIS_BTCorBTT': function(pkt)
	{
		var state = this.getBtnStack(pkt.ucid);
		if (!state[pkt.clickid])
			return;

		state[pkt.clickid](pkt);
	},
	'onIS_BFN' : function(pkt)
	{
		if (pkt.subt == this.client.insim.BFN_USER_CLEAR)
		{
			this.buttons[ucid] = [];
			this.buttons[ucid].length = this.MAX_ID;
			return;
		}
	},
	'onStateConnNew': function(ucid)
	{
		// clear any previous state
		this.buttons[ucid] = [];
		this.buttons[ucid].length = this.MAX_ID;
	},
	'onStateConnLeave': function(ucid)
	{
		// clear any state
		if (this.buttons[ucid])
			delete this.buttons[ucid];
	}
}

exports.init = function(options)
{
	this.log.info('Registering buttons plugin');

	this.client.registerHook('preconnect', function()
	{
		// setup state
		this.client.buttons = new ButtonsState(this.client);

		// setup hooks
		this.client.buttons.registerHooks(this.client);
	});

	this.client.registerHook('disconnect', function()
	{
		// clear hooks
		this.client.buttons.unregisterHooks(this.client);

		// clear any known state
		this.client.buttons = undefined;
	});
}
