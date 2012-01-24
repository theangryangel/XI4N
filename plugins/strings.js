var util = require('util'),
	fs = require('fs'),
	stream = null,
	strings = require('../lib/strings');

exports.init = function(options)
{
	this.log.info('Registering Strings Test');

	stream = fs.createWriteStream("./test-utf8.log");

	this.client.registerHook('IS_MSO', function(pkt)
	{
		console.log('got mso = \'%s\'', pkt.msg);
		var t = strings.toUTF8(pkt.msg);
		console.log('translated mso = \'%s\'', t);

		stream.write(t);
	});
}
