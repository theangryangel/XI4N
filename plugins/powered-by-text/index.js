"use strict";

exports.associate = function(options)
{
	this.log.info('Registering poweredby plugin');

	this.on('IS_NCN', function(pkt)
	{
		if (pkt.ucid <= 0)
			return;

		var welcome = new this.insim.IS_MTC;
		welcome.ucid = pkt.ucid;
		welcome.text = 'This server is powered by ' + this.product.full;

		this.send(welcome);
	});
}
