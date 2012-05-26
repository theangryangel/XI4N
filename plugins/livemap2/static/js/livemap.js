var LiveMap = function() {
	this.showTitle = false;
};

LiveMap.prototype = {
	callbacks: {},

	// event framework
	on: function(event, callback)
	{
		var self = this;

		if (!callback)
			return;

		if (typeof event == 'object')
		{
			for (var i in event)
				self.on(event[i], callback);
			return;
		}

		this.callbacks[event] = this.callbacks[event] || [];
		this.callbacks[event].push(callback);

		return this;
	},
	emit: function(event, data)
	{
		this.trigger(event, data);

		return this;
	},
	trigger: function(event, data)
	{
		var chain = this.callbacks[event];

		if(typeof chain == 'undefined')
			return;

		for(var i = 0; i < chain.length; i++)
			chain[i](data);
	},

	dest: '',
	basePath: '/static/pth/',
	pth: {},
	plyrs: {},
	fancy: 1000,
	drawn: false,
	showTitle: false,

	// actual usable functions
	loadPth: function(pth)
	{
		var self = this;

		if (!pth)
			return;

		self.clearPth();

		d3.json(
			(self.basePath + pth),
			function (data)
			{
				if (data == null)
				{
					self.emit('track404', pth);
					return;
				}

				self.pth.data = data;

				var i = 0;

				for (var d in data.nodes)
				{
					i++;

					if (data.nodes[d].x > self.pth.max.x)
						self.pth.max.x = data.nodes[d].x;

					if (data.nodes[d].x < self.pth.min.x)
						self.pth.min.x = data.nodes[d].x;

					if (-data.nodes[d].y > self.pth.max.y)
						self.pth.max.y = -data.nodes[d].y;

					if (-data.nodes[d].y < self.pth.min.y)
						self.pth.min.y = -data.nodes[d].y;
				}

				self.pth.data.length = i;

				self.emit('pth');
			}
		);
	},
	clearPth: function()
	{
		this.pth = {
			data: {}, min: { x: 0, y: 0, }, max: { x: 0, y: 0 },
			x: null, y: null
		};

		this.plyrs = {};
	},
	drawTrack: function()
	{
		var self = this;

		self.emit('draw');

		if (self.pth.data.length <= 0)
		{
			console.error('No pth loaded');
			return;
		}

		self.clear();

		var graph = d3.select(self.dst)
			.append("svg:svg")
			.attr("width", "100%")
			.attr("height", "100%");

		var height = d3.select(self.dst).style('height').replace('px','')-20;
		var scalingfactor = ((self.pth.max.y - self.pth.min.y) / height);
		var width = ((self.pth.max.x - self.pth.min.x) / scalingfactor);

		d3.select(self.dst).style('width', (width + 20) + 'px');

		self.pth.y = d3.scale.linear()
			.domain([-self.pth.min.y, -self.pth.max.y])
			.range([20, height]);

		self.pth.x = d3.scale.linear()
			.domain([self.pth.min.x, self.pth.max.x])
			.range([20, width]);

		var line = d3.svg.line()
			.x(function(d, i)
			{
				return self.pth.x(d.x);
			})
			.y(function(d)
			{
				return self.pth.y(d.y);
			})
			.interpolate("basis-closed");

		graph.append("svg:path")
			.attr("d", line(self.pth.data.nodes))
			.attr("class", "track");

		if (self.showTitle && self.pth.data.track)
		{
			graph.append("text")
				.attr("class", "title")
				.attr("y", 20)
				.attr("x", 10)
				.text(self.pth.data.track);
		}

		if (self.pth.data.startfinish)
		{
			graph.append("svg:rect")
				.attr("x", self.pth.x(self.pth.data.startfinish.x) - 5)
				.attr("y", self.pth.y(self.pth.data.startfinish.y))
				.attr("width", 10)
				.attr("height", 2)
				.style("fill", "#666");
		}

		self.drawn = true;
	},
	addPlyr: function(data)
	{
		var self = this;

		self.plyrs[data.plid] = data;

		self.emit('addplyr', data.plid);
	},
	getPlyr: function(plid)
	{
		var self = this;
		return self.plyrs[plid];
	},
	highlightPlyr: function(plid)
	{
		var self = this;
		if (!self.plyrs[plid])
			return;

		if (!self.plyrs[plid].svg)
			return; // probably an out of sync or new player

		self.plyrs[plid].svg.classed('player-highlight', true);
	},
	unhighlightPlyr: function(plid)
	{
		var self = this;
		if (!self.plyrs[plid])
			return;

		if (!self.plyrs[plid].svg)
			return;

		self.plyrs[plid].svg.classed('player-highlight', false);
	},
	updatePlyr: function(plid, data)
	{
		var self = this;

		if (!self.plyrs[plid])
		{
			self.addPlyr(data);
		}
		else
		{
			for (var i in data)
				self.plyrs[plid][i] = data[i];
		}

		self.emit('updateplyr', plid)
	},
	drawPlyr: function(plid)
	{
		var self = this;

		var p = self.plyrs[plid];

		if (!p)
			return;

		self.plyrs[plid].svg = self.plyrs[plid].svg || d3.select(self.dst + ' svg').append("svg:circle")
			.attr("r", 4)
			.attr("class", "player");

		if (!self.drawn)
			return;

		if (self.fancy > 0)
		{
			self.plyrs[plid].svg
				.transition()
				.attr("cx", self.pth.x(p.x))
				.attr("cy", self.pth.y(p.y))
				.duration(self.fancy)
				.ease("linear");
		}
		else
		{
			self.plyrs[plid].svg
				.attr("cx", self.pth.x(p.x))
				.attr("cy", self.pth.y(p.y))
		}

		self.emit('drawplyr', plid);
	},
	remPlyr: function(plid)
	{
		var self = this;

		self.emit('remplyr', plid);

		if (self.plyrs[plid])
		{
			self.clearPlyr(plid);
			delete self.plyrs[plid];
		}
	},
	clearPlyr: function(plid)
	{
		var self = this;

		self.emit('clearplyr', plid);

		if (self.plyrs[plid] && self.plyrs[plid].svg)
			self.plyrs[plid].svg.remove();
	},
	clear: function()
	{
		self.drawn = false;
		d3.select(this.dst).selectAll("svg").remove();

		this.emit('clear');
	},
};

