/**
 * Very, very dumb anti-idler plugin
 */

var plugin = function(options)
{
	self.idlers = {
		'race': 0,
		'changed': new Date().getTime(),
		'warnings': []
	};
}

plugin.prototype.associate = function(client)
{
	var self = this;

	client.log.info('Registering Busy (anti-idler) Plugin');
	client.options.isiflags |= client.insim.ISF_MCI;

	client.on('IS_STA', function(pkt)
	{
		if (self.idlers.race != pkt.raceinprog)
		{
			self.idlers.race = pkt.raceinprog;

			// race started + X seconds to negate countdown
			self.idlers.changed = (new Date().getTime()) + 20000;
		}
	});

	client.on('state:plyrnew', function(plid)
	{
		self.idlers.warnings[plid] = 0;
	});

	client.on('state:plyrupdate', function(plids)
	{
		if (!self.idlers.race)
			return;

		var now = new Date().getTime();

		if (self.idlers.changed >= now)
			return;

		for (var i in plids)
		{
			var p = this.state.getPlyrByPlid(plids[i]);
			if (!p)
				continue;

			var c = this.state.getConnByUcid(p.ucid);

			if (!c)
				continue;

			if (p.speed > 10)
			{
				self.idlers.warnings[plids[i]] = 0;
				continue;
			}

			self.idlers.warnings[plids[i]]++;

			if (self.idlers.warnings[plids[i]] == 10)
			{
				var warn = new this.insim.IS_MTC;
				warn.ucid = p.ucid;
				warn.text = '^3Move, or you\'ll be spectated for idling.';
				this.send(warn);
			}
			
			if (self.idlers.warnings[plids[i]] > 20)
			{
				// spectate the racer for idling
				var spec = new this.insim.IS_MST;
				spec.msg = "/spec " + c.uname;

				this.send(spec);
			}
		}
	});

	client.on('state:plyrleave', function(plid)
	{
		if (self.idlers.warnings[plid])
			delete self.idlers.warnings[plid];
	});
}

module.exports = plugin;
