var glob = require('glob'),
	path = require('path');

desc('Generate documentation from source');
task('generate-docs', [], function (params)
{

	glob("./lib/*.js", {}, function (er, files) {
		var cmds = [];

		for (var i in files)
		{
			var dst = path.basename(files[i]).replace(/js$/, 'md');
			cmds.push('dox --raw < ' + files[i] + ' | node ./build/docs.js > ./docs/' + dst);
		}

		jake.exec(cmds, function ()
		{
			console.log('All docs generated.');
			complete();
		}, {printStdout: true});

	});

}, {async: true});
