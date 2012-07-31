"use strict";

exports.init = function(options)
{
	this.log.info('Registering poweredby plugin');

	this.client.registerHook('IS_NPL', function(pkt)
	{
		if (pkt.ucid <= 0)
			return;

		var welcome = new this.insim.IS_BTN;
		welcome.ucid = pkt.ucid;
		welcome.reqi = 1;
		welcome.bstyle |= this.insim.ISB_DARK | this.insim.ISB_LEFT | this.insim.ISB_CLICK;
		welcome.text = '^7Powered by ' + this.product.full;
		welcome.l = 5;
		welcome.t = 180;
		welcome.w = (welcome.text.length - 2) * 1.9;
		welcome.h = 10;

		var callback = function(insim, client, ucid)
		{
			return function(inbound)
			{
				var p = new insim.IS_BFN;
				p.ucid = ucid;
				p.clickid = inbound.clickid;
				p.subt = insim.BFN_DEL_BTN;

				client.send(p);
			}
		}(this.insim, this.client, pkt.ucid);

		this.client.buttons.add(welcome, callback);
	});
}
