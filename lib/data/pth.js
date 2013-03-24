var path = require('path'),
	file = require('file'),
	canonical = path.join(__dirname, '..', '..', 'pth');

exports.canonical = canonical;
exports.get = function(track)
{
	var f = path.join(canonical, track + '.json');
	if (!file.existsSync(f))
		return new Error('Unknown track!');

	return require(f);
}
