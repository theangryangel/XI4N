var util = require('util');

var ucids = [];
var plids = [];

exports.init = function()
{
	this.log.info('Registering MCI plugin');
	this.client.isiFlags |= this.insim.ISF_MCI;

	this.client.registerHook('IS_MCI', exports.mci);

	//this.client.registerHook('IS_NCN', exports.ncn);
}

exports.connected = function(pkt)
{
	// Request info on connections and players
	// request TINY_NCN
	// request TINY_NPL
	// request  
}

/*
exports.ncn = function(pkt)
{
	ucid[pkt.ucid] = 
}
*/

exports.mci = function(pkt)
{
	for (var i = 0; i < pkt.numc; i++)
		console.log('plid ' + pkt.compcar[i].plid + ' is on lap # ' + pkt.compcar[i].lap);
}
