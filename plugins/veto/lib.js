'use strict';

var _ = require('underscore');

var plugin = function(options)
{
}

plugin.prototype.associate = function(client)
{
	client.log.info('Registering Veto Plugin');

	client.on('IS_VTN', function(pkt)
	{
		if (pkt.action == this.insim.VOTE_NONE)
			return;

		if (pkt.ucid == 0)
			return;

		var cancel = new this.insim.IS_TINY;
		cancel.subt = this.insim.TINY_VTC;

		this.send(cancel);
	});
}

module.exports = plugin;
