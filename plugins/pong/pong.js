exports.init = function(options)
{
	this.log.info('Registering Ping/Pong plugin');
	this.client.registerHook('IS_TINY', exports.pong);
}

exports.pong = function()
{
	this.log.debug('PING? PONG!');
	var p = new this.insim.IS_TINY();
	p.subt = this.insim.TINY_NONE;
	
	this.client.send(p);
}
