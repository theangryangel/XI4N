require('js-yaml');

var util = require('util'),
	conf = require('./config.yaml');

console.log(util.inspect(conf, { depth: null }));
