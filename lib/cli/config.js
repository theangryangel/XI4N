'use strict';

require('js-yaml');

var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	app = express(),
	routes = require('./config/routes'),
	port = 3000;

module.exports = function(target)
{
	process.chdir(target);

	app.use(express.bodyParser());

	// custom html view engine - we're not needing anything complex
	app.engine('html', function(filename, options, cb)
	{
		fs.readFile(filename, 'utf8', function(err, str)
		{
			cb(err, str);
		});
	});
	app.set('view engine', 'html');
	app.set('views', __dirname + '/config/views');
	app.use(express.static(__dirname + '/config/public'));

	app.get('/', routes.index);

	// yeah this isn't restful. suck it.
	app.get('/load', routes.load);
	app.post('/save', routes.save);
	app.get('/plugins', routes.plugins);
	app.get('/quit', routes.quit);

	// angular's in html5 mode
	app.get('*', routes.index);

	app.listen(port, 'localhost');

	console.log();
	console.log('  open a web browser and head to http://localhost:' + port + '/');
	console.log('  ctrl + c to shutdown');
	console.log();
}
