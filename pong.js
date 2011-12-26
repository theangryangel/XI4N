var insim = require('./insim');

exports.init = function()
{
	console.log('Registering Ping/Pong plugin');
	this.client.registerHook('IS_TINY', exports.pong);
}

exports.pong = function()
{
	console.log('PING?');
	var p = this.client.createPacket('IS_TINY');
	p.subt = insim.TINY_NONE;
	
	this.client.send(p);
	console.log('PONG!');
}
