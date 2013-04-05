'use strict';

var db = require('dirty')('user.db');

var model = {
	fetch: function(database, userid)
	{
		var id = this.id(userid);
		var m = database.get(id);
		if (!m)
			m = { points: 0, position: { x: null, y: null, z: null }, last: (new Date().getTime()), milestone: 0 };

		return m;
	},
	save: function(database, userid, model)
	{
		var id = this.id(userid);
		database.set(id, model);
	},
	id: function(userid)
	{
		return userid.toLowerCase();
	}
};

var plugin = function(options)
{
}

plugin.prototype.associate = function(client)
{
	client.log.info('Registering slmbr plugin');

	client.options.isiflags |= client.insim.ISF_MCI;

	client.on('state:connnew', function(ucid)
	{
		if (ucid <= 0)
			return;

		var c = this.state.getConnByUcid(ucid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);

		var messages = [
			'^3Welcome to slmbr.',
			'^3Life cruising too fast? Slmbr is for you.',
			'^3Gain points by not moving. 1 point every 10 seconds.',
			'^3Your current points are: ' + m.points + '.',
			'^3Type !pts to show your current points.',
		];

		for (var i = 0; i < messages.length; i++)
		{
			var welcome = new this.insim.IS_MTC;
			welcome.ucid = ucid;
			welcome.text = messages[i];

			this.send(welcome);
		}
	});

	client.on('state:plyrnew', function(plid)
	{
		var p = this.state.getPlyrByPlid(plid);

		if (!p)
			return; // some how got a plid that we don't know about in the state

		var c = this.state.getConnByUcid(p.ucid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);
		m.last = new Date().getTime();
		model.save(db, c.uname, m);
	});

	client.on('state:plyrleave', function(plid)
	{
		var p = this.state.getPlyrByPlid(plid);
		if (!p)
			return;

		var c = this.state.getConnByUcid(p.ucid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);

		var messages = [
			'^3Thanks for slmbr\'ing.',
			'^3Your current points are: ' + m.points + '.'
		];

		for (var i = 0; i < messages.length; i++)
		{
			var welcome = new this.insim.IS_MTC;
			welcome.ucid = p.ucid;
			welcome.text = messages[i];

			this.send(welcome);
		}
	});

	client.on('state:plyrupdate', function(plids)
	{
		for (var i in plids)
		{
			var p = this.state.getPlyrByPlid(plids[i]);
			if (!p)
				continue;

			var c = this.state.getConnByUcid(p.ucid);

			if (!c)
				continue;

			var time = new Date().getTime();
			var m = model.fetch(db, c.uname);

			if (m.position.x == null)
			{
				m.position.x = p.x;
				m.position.y = p.y;
				m.position.z = p.z;
				m.last = time;

				model.save(db, c.uname, m);
			}

			if ((time - m.last >= 10000) && (m.position.x != null))
			{
				m.last = time;

				var x = m.position.x - p.x;
				var y = m.position.y - p.y;
				var z = m.position.z - p.z;
				
				var xy = x^2 + y^2;
				var d = Math.abs(xy^2 + z^2);

				if (d < 10000)
					m.points += 1;

				if ((m.points != m.milestone) && ((m.points % 10) == 0))
				{
					m.milestone = m.points;

					var messages = [
						'^3New milestone reached!',
						'^3Your current points are: ' + m.points + '.'
					];

					for (var i = 0; i < messages.length; i++)
					{
						var welcome = new this.insim.IS_MTC;
						welcome.ucid = p.ucid;
						welcome.text = messages[i];

						this.send(welcome);
					}
				}

				m.position.x = p.x;
				m.position.y = p.y;
				m.position.z = p.z;

				model.save(db, c.uname, m);
			}
		}
	});

	client.on('IS_MSO', function(pkt)
	{
		if (pkt.usertype != this.insim.MSO_USER)
			return;

		var msg = pkt.msg.substr(pkt.msg.textstart);
		if (msg.indexOf('!pts') < 0)
			return;

		var c = this.state.getConnByUcid(pkt.ucid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);

		var welcome = new this.insim.IS_MTC;
		welcome.ucid = pkt.ucid;
		welcome.text = '^3Your current points are: ' + m.points + '.';

		this.send(welcome);
	});
}

module.exports = plugin;
