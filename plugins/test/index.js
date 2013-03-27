var plugin = function(options)
{
	this.options = options;
	this.count = 0;
}

plugin.prototype.associate = function(client)
{
	var self = this;

	client.on('IS_MSO', function(packet)
	{
		self.count++;
		console.log("[%s] %d = %s", self.options.name, self.count, packet.msg);
	});
}

module.exports = plugin;
