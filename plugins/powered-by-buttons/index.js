"use strict";

var plugin = function(options)
{
}

plugin.prototype.associate = function(client)
{
	client.log.info('Registering poweredby plugin');

	client.on('IS_NCN', function(pkt)
	{
		if (pkt.ucid <= 0)
			return;

		var welcome = new this.insim.IS_BTN;
		welcome.ucid = pkt.ucid;
		welcome.reqi = 1;
		welcome.bstyle |= this.insim.ISB_DARK | this.insim.ISB_LEFT;
		welcome.text = '^7Powered by ' + this.product.full;
		welcome.l = 5;
		welcome.t = 170;
		welcome.w = (welcome.text.length - 2) * 1.9;
		welcome.h = 10;
		welcome.clickid = 1;

		setTimeout(function(ctx, ucid, clickid)
		{
			return function()
			{
				var p = new ctx.insim.IS_BFN;
				p.ucid = ucid;
				p.clickid = 1;
				p.subt = ctx.insim.BFN_DEL_BTN;

				ctx.send(p);
			};
		}(this, pkt.ucid, clickid), 5000);
	});
}

module.exports = plugin;
