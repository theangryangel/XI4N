/**
 * Very, very dumb anti-idler plugin
 */
exports.associate = function()
{
	this.log.info('Registering Busy (anti-idler) Plugin');

	this.options.isiflags |= this.insim.ISF_MCI;

	// Per-client state
	// TODO - Need an API for this to stop things getting overwritten by another
	// plugin?
	this.idlers = {
		'race': 0,
		'changed': new Date().getTime(),
		'warnings': []
	};

	this.on('IS_STA', function(pkt)
	{
		if (this.idlers.race != pkt.raceinprog)
		{
			this.idlers.race = pkt.raceinprog;

			// race started + X seconds to negate countdown
			this.idlers.changed = (new Date().getTime()) + 20000;
		}
	});

	this.on('state:plyrnew', function(plid)
	{
		this.idlers.warnings[plid] = 0;
	});

	this.on('state:plyrupdate', function(plids)
	{
		if (!this.idlers.race)
			return;

		var now = new Date().getTime();

		if (this.idlers.changed >= now)
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
				this.idlers.warnings[plids[i]] = 0;
				continue;
			}

			this.idlers.warnings[plids[i]]++;

			if (this.idlers.warnings[plids[i]] == 10)
			{
				var warn = new this.insim.IS_MTC;
				warn.ucid = p.ucid;
				warn.text = '^3Move, or you\'ll be spectated for idling.';
				this.send(warn);
			}
			
			if (this.idlers.warnings[plids[i]] > 20)
			{
				// spectate the racer for idling
				var spec = new this.insim.IS_MST;
				spec.msg = "/spec " + c.uname;

				this.send(spec);
			}
		}
	});

	this.on('state:plyrleave', function(plid)
	{
		if (this.idlers.warnings[plid])
			delete this.idlers.warnings[plid];
	});
}
