var path = require('path'),
	fs = require('fs'),
	canonical = path.join(__dirname, '..', '..', 'pth');

exports.canonical = canonical;
exports.get = function(track)
{
	var f = path.join(canonical, track + '.json');
	if (!fs.existsSync(f))
		return new Error('Unknown track!');

	return require(f);
}
