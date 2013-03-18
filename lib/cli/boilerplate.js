var path = require('path'),
	fs = require('fs-extra');

module.exports = function(target)
{
	fs.mkdirpSync(target);

	var boilerplate = [
		'package.json',
		'index.js'
	];

	for (var i in boilerplate)
		fs.copy(path.join(__dirname, 'boilerplate', 'plugin', boilerplate[i]), path.join(target, boilerplate[i]));

	process.on('exit', function()
	{
		console.log();
		console.log('  now what? go to \'%s\', and start editing', target);
		console.log();
	});
}
