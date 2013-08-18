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
	var conf = yaml.load(fs.readFileSync(path.join(process.cwd(), 'config.yaml'), 'utf8'));
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

	var system = path.resolve(path.join(__dirname, '../../../plugins')),
		local = path.resolve(path.join(process.cwd(), 'plugins'));

	var filter_plugins = function(directory, plugin)
	{
		var file = path.join(directory, plugin);
		return (
			(fs.existsSync(file)) &&
			(fs.statSync(file).isDirectory()) && 
			(fs.existsSync(path.join(file, 'package.json')))
		);
	}

	// system plugins
	a = a.concat(fs.readdirSync(system).filter(function(element, index, array)
	{
		return filter_plugins(system, element);
	}));
	
	if (system != local)
	{
		// local plugins
		a = a.concat(fs.readdirSync(local).filter(function(element, index, array)
		{
			return filter_plugins(local, element);
		}));
	}

	res.json(a);
}

exports.quit = function(req, res, next)
{
	process.exit(0);
}
