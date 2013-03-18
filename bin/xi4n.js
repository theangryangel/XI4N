#!/usr/bin/env node

var program = require('commander')
	xi4n = require('../lib'),
	path = require('path')
	fs = require('fs');

program.version(xi4n.product.version);

program.command('init')
	.description('-> initialise ' + xi4n.product.name + ' configuration instance')
	.option('-f, --force', 'overwrite files that already exist')
	.action(function(options)
	{
		var target = program.args.shift();
		if (typeof target != 'string')
			target = '.';

		target = path.resolve(target);

		if (!options.force && fs.existsSync(target))
		{
			console.error();
			console.error(' error: path \'%s\' already exists', target);
			console.error('        retry with --force if you really want to do this');
			console.error();
			process.exit(1);

			return;
		}

		xi4n.cli.init(target);
		return;
	});

program.command('start')
	.description('-> starts a ' + xi4n.product.name + ' configuration instance')
	.action(function(options)
	{
		var target = program.args.shift();
		if (typeof target != 'string')
			target = '.';

		target = path.resolve(target);

		if (!fs.existsSync(target))
		{
			console.error();
			console.error(' error: path \'%s\' does not exist', target);
			console.error();
			process.exit(1);

			return;
		}

		xi4n.cli.start(target);
	});

program.command('boilerplate <NAME>')
	.description('-> generate a new plugin from boilerplate')
	.option('-f, --force', 'overwrite files that already exist')
	.action(function(name, options)
	{
		var target = name;
		target = path.resolve(target);

		if (fs.existsSync(target))
		{
			console.error();
			console.error(' error: path \'%s\' already exists', target);
			console.error('        retry with --force if you really want to do this');
			console.error();
			process.exit(1);

			return;
		}

		xi4n.cli.boilerplate(name, options.force);
	});

program.command('docs')
	.description('-> start a local webserver, with documentation')
	.action(function()
	{
		xi4n.cli.docs();
	});

// for those who aren't familiar with flags, just incase they try it
program.command('help')
	.description('-> output usage information')
	.action(function()
	{
		program.help();
	});

program.parse(process.argv);
