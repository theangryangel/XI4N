var util = require('util');

exports.init = function(options)
{
	this.log.info('Registering Monitor plugin');

	if (options.http)
	{
		var http = require('http');
		http.createServer(function (req, res)
		{
			res.writeHead(200, {'Content-Type': 'text/plain'});
			var text = 'uptime = ' + process.uptime() + '\r\n';
			var mem = process.memoryUsage();
			for(var i in mem)
				text += '\r\n' + i + ' = ' + mem[i];

			res.end(text);
		}).listen(options['http-port'] || 9615);
	}

	var seconds = options.seconds || 10;

	if (options.log && (seconds > 0))
	{
		var log = this.log;

		setInterval(function() {
			log.info('Mem stats ' + util.inspect(process.memoryUsage()));
			log.info('Node Uptime ' + process.uptime());
		},
		1000 * seconds);
	}
}
