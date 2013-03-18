'use strict';

var path = require('path'),
	fs = require('fs'),
	pkg = JSON.parse(fs.readFileSync(path.join('..', 'package.json'), 'utf8'));

exports.source = "src";
exports.output = "output";
exports.permalink = "{{directory}}/{{filename}}.html";
exports.theme = "theme";
exports.sitename = pkg.name + '-docs ' + pkg.version;
exports.product = pkg;

exports.writers = [
	"nico.PostWriter",
	"nico.PageWriter",
	"nico.FileWriter",
	"nico.StaticWriter"
];
