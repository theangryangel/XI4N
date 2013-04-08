var path = require('path'),
	fs = require('fs'),
	yaml = require('js-yaml');

exports.index = function(req, res, next)
{
	res.render('index');
}

exports.load = function(req, res, next)
{
	// we've already chdir'ed into the target directory!
	var conf = require(path.join(process.cwd(), 'config.yaml'));
	res.json(conf);
}

exports.save = function(req, res, next)
{
	var payload = yaml.dump(req.body);
	res.json(req.body); // echo it back for the lols
}

exports.plugins = function(req, res, next)
{
	// return a list of plugins
	var a = [];

	// system plugins
	a = a.concat(fs.readdirSync(path.join(__dirname, '../../../plugins')));
	
	// local plugins
	//a = a.concat(fs.readdirSync(process.cwd(), 'plugins'));

	res.json(a);
}

exports.quit = function(req, res, next)
{
	process.exit(0);
}
