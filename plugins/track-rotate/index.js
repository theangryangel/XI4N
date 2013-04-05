'use strict';

var _ = require('underscore');

var defaults = {
	// track rotations
	rotation: [],
	// number of races per rotation
	duration: 5,
	// timeout
	countdown: 90
};

var plugin = function(options)
{
	this.options = _.defaults(options, defaults);

	this.count = 0;
}

plugin.prototype.associate = function(client)
{
	var self = this;

	client.on('IS_RST', function(packet)
	{
		self.count++;
	});

	client.on('IS_RES', function(packet)
	{
		if (self.count < self.options.duration)
			return;

		var f = _.bind(function()
		{
			// change track
			this.send();

			self.count = 0;
		}, this);

		setTimeout(f, self.countdown * 1000);
	});
}

module.exports = plugin;
