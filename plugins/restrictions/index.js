'use strict';

var plugin = function(options)
{
	// options in format of:
	// options = { 
	// 	XFG: { h_tres: 5, h_mass: 5 },
	// }
	
	this.options = {};

	// lower case all the keys
	for (var i in options)
		this.options[i.toLowerCase()] = options[i];
}

plugin.prototype.associate = function(client)
{
	var self = this;

	var onPlyrUpdate = function(pkt)
	{
		var vehicle = pkt.cname.toLowerCase();
		var restriction = this.options[vehicle];

		if (!restriction)
			return;

		if (pkt.h_mass >= restriction.h_mass && pkt.h_tres >= restriction.h_tres)
			return;

		var c = this.client.state.getConnByPlid(pkt.plid);

		var spec = new this.insim.IS_MST;
		spec.msg = "/spec " + c.uname;
	}

	client.on('state:plyrnew', onPlyrUpdate);
	client.on('state:plyrupdate', onPlyrUpdate);
}

module.exports = plugin;
