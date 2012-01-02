var insim = require('./insim'),
	util = require('util');

exports.init = function()
{
	this.log.info('Registering MCI plugin');
	this.client.registerHook('IS_MCI', exports.mci);
}

exports.mci = function(pkt)
{
	for (var i = 0; i < pkt.numc; i++)
		console.log('plid ' + pkt.compcar[i].plid + ' is on lap # ' + pkt.compcar[i].lap);
}
