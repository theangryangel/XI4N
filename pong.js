var insim = require('./insim');

exports.init = function()
{
	this.log.info('Registering Ping/Pong plugin');
	this.client.registerHook('IS_TINY', exports.pong);
}

exports.pong = function()
{
	this.log.info('PING?');
	var p = this.client.createPacket('IS_TINY');
	p.subt = insim.TINY_NONE;
	
	this.client.send(p);
	this.log.info('PONG!');
}
