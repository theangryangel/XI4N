var path = require('path'),
	fs = require('fs'),
	canonical = path.join(__dirname, '..', '..', 'pth');

exports.canonical = canonical;
exports.get = function(track)
{
	// try the local path first
	var f = path.join(process.pwd(), 'data', track + '.json');
	if (fs.existsSync(f))
		return require(f);

	// otherwise fall back to the bundled files
	f = path.join(canonical, track + '.json');
	if (fs.existsSync(f))
		return require(f);

	return new Error('Unknown track!');
}
