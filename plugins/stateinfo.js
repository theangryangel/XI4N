var state = null;

exports.init = function(options)
{
	this.log.info('Registering StateInfo Test');

	var http = require('http');
	var fs = require('fs');
	var util = require('util');

	this.client.on('connect', function()
	{
		console.log('stateinfo got connect');
		state = this.client.state;

		var express = require('express').createServer();
		express.listen(options['http-port'] || 8080);

		// disable the layout
		express.set("view options", { layout: false });

		// templates in
		express.set('views', __dirname + '/stateinfo/views');

		// setup underscore as our templating engine
		// jade makes me feel ill
		express.register('.html', {
			compile: function(str, options)
			{
				var compiled = require('underscore').template(str);
				return function(locals) {
					return compiled(locals);
				};
			}
		});

		express.get('/', function (req, res)
		{
			var d = new Date;
			res.render('index.html', { 'state': state, 'datetime': d.toISOString() });
		});
	});
}
