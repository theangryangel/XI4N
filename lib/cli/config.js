'use strict';

require('js-yaml');

var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	app = express(),
	port = 3000,
	yaml = require('js-yaml');

var config = {
	path: path.join(process.cwd(), 'config.yaml'),
	read: function()
	{
		return yaml.load(fs.readFileSync(this.path, 'utf8'));
	},
	write: function(content)
	{
		fs.writeFileSync(this.path, yaml.dump(content));
	}
};

module.exports = function(target)
{
	process.chdir(target);

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

	app.use(express.bodyParser());

	var index = function(req, res)
	{
		res.render('index');
	}

	app.get('/', index);

	// available plugins
	app.get('/plugins', function(req, res)
	{
		// return a list of plugins
		var a = [];
	
		var system = path.resolve(path.join(__dirname, '../../plugins')),
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

		var r = [];

		for (var i in a)
			r.push({ path: a[i] });
	
		res.json(r);
	});

	// config
	app.get('/config', function(req, res)
	{
		res.json(config.read());
	});

	app.get('/config/version', function(req, res)
	{
		var c = config.read();
		res.json([ c.xi4n ]);
	});

	app.put('/config/version', function(req, res)
	{
		if (!req.body.version)
			return res.status(400).end();

		var c = config.read();
		c.xi4n = req.body.version;
		config.write(c);
		res.end();
	});

	// connection routes
	app.get('/config/connections', function(req, res)
	{
		// list of config/connections
		var c = config.read();
		res.json(c.connections);
	});

	app.get('/config/connections/new', function(req, res)
	{
		// html new form
	});

	app.post('/config/connections', function(req, res)
	{
		// create connection
	});

	app.get('/config/connections/:id', function(req, res)
	{
		// return connection
		var c = config.read();
		res.json(c.config/connections[req.params.id]);
	});

	app.get('/config/connections/:id/edit', function(req, res)
	{
		//html edit form
	});

	app.put('/config/connections/:id', function(req, res)
	{
		// update existing
	});

	app.delete('/config/connections/:id', function(req, res)
	{
		// delete connection
		var id = req.params.id;
		
		var c = config.read();

		if (!c.connections[id])
			return res.status(400).end();

		c.connections.splice(id, 1);
		config.write(c);
		res.end();
	});

	// config/plugins routes
	app.get('/config/plugins', function(req, res)
	{
		// list of config/connections
		var c = config.read();
		res.json(c.plugins);
	});

	app.get('/config/plugins/new', function(req, res)
	{
		// html new form
	});

	app.post('/config/plugins', function(req, res)
	{
		// create connection
	});

	app.get('/config/plugins/:id', function(req, res)
	{
		// return connection
		var c = config.read();
		res.json(c.config/plugins[req.params.id]);
	});

	app.get('/config/plugins/:id/edit', function(req, res)
	{
		//html edit form
	});

	app.put('/config/plugins/:id', function(req, res)
	{
		// update existing
	});

	app.delete('/config/plugins/:id', function(req, res)
	{
		// delete plugin
		var id = req.params.id;
		
		var c = config.read();

		if (!c.plugins[id])
			return res.status(400).end();

		var alias = c.plugins[id].alias;
		for (var i in c.connections)
		{
			var idx = c.connections[i].use.indexOf(alias);
			if (idx < 0)
				continue;

			c.connections[i].use.splice(idx, 1);
		}

		c.plugins.splice(id, 1);

		config.write(c);
		res.end();
	});

	app.get('/quit', function (req, res)
	{
		process.exit(0);
	});

	// angular's in html5 mode
	app.get('*', index);

	app.listen(port, 'localhost');

	console.log();
	console.log('  open a web browser and head to http://localhost:' + port + '/');
	console.log('  ctrl + c to shutdown');
	console.log();
}
