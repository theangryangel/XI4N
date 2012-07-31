exports.init = function()
{
	this.log.info('Registering Veto Plugin');

	this.client.on('IS_VTN', function(pkt)
	{
		if (pkt.action == this.insim.VOTE_NONE)
			return;

		if (pkt.ucid == 0)
			return;

		var cancel = new this.insim.IS_TINY;
		cancel.subt = this.insim.TINY_VTC;

		this.client.send(cancel);
	});
}
