"use strict";

exports.init = function(options)
{
	this.log.info('Registering poweredby plugin');

	this.client.registerHook('IS_NCN', function(pkt)
	{
		if (pkt.ucid <= 0)
			return;

		var welcome = new this.insim.IS_MTC;
		welcome.ucid = pkt.ucid;
		welcome.text = 'This server is powered by ' + this.product.full;

		this.client.send(welcome);
	});
}
