'use strict';

var port = 3000;

module.exports = function()
{
	var express = require('express');
	var app = express();

	app.use(express.static(__dirname + '/../../docs/html'));

	app.listen(port, 'localhost');

	console.log();
	console.log('  static file server running at http://localhost:' + port + '/');
	console.log('  ctrl + c to shutdown');
	console.log();
}
