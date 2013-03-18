require('js-yaml');

var util = require('util'),
	product = require('./lib/product');

console.log(util.inspect(product, { depth: null }));
