"use strict";

/**
 * button manager
 *
 * TODO should buttonsstate be an event emitter? or is our half rolled version
 * good enough?
 */

var utils = require('util'),
	events = require('events');


var ButtonsState = function()
{
	// sparse array of arrays organised by 
	//  this.buttons[UCID][buttonClickId]
	this.buttons = [];
}

ButtonsState.prototype = {
	'hooks': {
		'IS_BTC': 'onIS_BTCorBTT',
		'IS_BTT': 'onIS_BTCorBTT',
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
		// add to this.buttons[ucid][clickid]
	},
	'remove': function(clickid, ucid)
	{
		// send IS_BFN
		delete this.buttons[ucid][clickid]
	},
	'onIS_BTCorBTT': function(pkt)
	{
		// IS_BTC or IS_BTT
		// Known?
		if (!this.buttons[pkt.ucid] || !this.buttons[pkt.ucid][pkt.clickid])
			return;

		this.buttons[pkt.ucid][pkt.clickid](pkt);
	},
	'onStateConnNew': function(ucid)
	{
		// clear any previous state
		this.buttons[ucid] = [];
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
		this.client.buttons = new ButtonsState;

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
