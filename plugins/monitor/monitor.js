var util = require('util');

exports.construct = function(options)
{
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
}
