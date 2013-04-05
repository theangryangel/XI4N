var util = require('util'),
	_ = require('underscore');

var plugin = function(options)
{
	this.options = _.defaults(options, {
		'http': true
		'http-port': 9615
	});

	if (!this.options.http)
		return;
	
	var http = require('http');
	http.createServer(function (req, res)
	{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		var text = 'uptime = ' + process.uptime() + '\r\n';
		var mem = process.memoryUsage();
		for(var i in mem)
			text += '\r\n' + i + ' = ' + mem[i];

		res.end(text);
	}).listen(this.options['http-port']);
}

plugin.prototype.associate = function()
{
}

module.exports = plugin;
