/**
 * Very, very dumb anti-idler plugin
 * TODO:
 *  Needs to be more intelligent
 *  Needs configuration options
 */
exports.init = function()
{
	this.log.info('Registering Busy (anti-idler) Plugin');

	this.client.isiFlags |= this.insim.ISF_MCI;

	// Per-client state
	// TODO - Need an API for this to stop things getting overwritten by another
	// plugin?
	this.client.idlers = {
		'race': 0,
		'changed': new Date().getTime(),
		'warnings': []
	};

	this.client.on('IS_STA', function(pkt)
	{
		if (this.client.idlers.race != pkt.raceinprog)
		{
			this.client.idlers.race = pkt.raceinprog;

			// race started + X seconds to negate countdown
			this.client.idlers.changed = (new Date().getTime()) + 20000;
		}
	});

	this.client.on('state:plyrnew', function(plid)
	{
		this.client.idlers.warnings[plid] = 0;
	});

	this.client.on('state:plyrupdate', function(plids)
	{
		if (!this.client.idlers.race)
			return;

		var now = new Date().getTime();

		if (this.client.idlers.changed >= now)
			return;

		for (var i in plids)
		{
			var p = this.client.state.getPlyrByPlid(plids[i]);
			if (!p)
				continue;

			var c = this.client.state.getConnByUcid(p.ucid);

			if (!c)
				continue;

			if (p.speed > 10)
			{
				this.client.idlers.warnings[plids[i]] = 0;
				continue;
			}

			this.client.idlers.warnings[plids[i]]++;

			if (this.client.idlers.warnings[plids[i]] == 10)
			{
				var warn = new this.insim.IS_MTC;
				warn.ucid = p.ucid;
				warn.text = '^3Move, or you\'ll be spectated for idling.';
				this.client.send(warn);
			}
			
			if (this.client.idlers.warnings[plids[i]] > 20)
			{
				// spectate the racer for idling
				var spec = new this.insim.IS_MST;
				spec.msg = "/spec " + c.uname;

				this.client.send(spec);
			}
		}
	});

	this.client.on('state:plyrleave', function(plid)
	{
		if (this.client.idlers.warnings[plid])
			delete this.client.idlers.warnings[plid];
	});
}
