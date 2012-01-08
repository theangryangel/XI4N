var path = require('path'),
	fs = require('fs'),
	basedir = path.join(__dirname, '..'),
	pkg = JSON.parse(fs.readFileSync(basedir + '/package.json', 'utf8'));

exports.basedir = basedir;
exports.name = pkg.name;
exports.version = pkg.version;
exports.full = pkg.name + ' v' + pkg.version;

