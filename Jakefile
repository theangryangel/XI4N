desc('Run tests');
task('tests', { async: true }, function ()
{
	console.log('Not implemented');
	complete();
});

desc('Generate static documentation');
task('docs', { async: true }, function () {
	var cmds = [
		'cd docs && node ../node_modules/.bin/nico build'
	];

	jake.exec(cmds, function ()
	{
		complete();
	}, {printStdout: true});
});
