exports.associate = function()
{
	this.log.info('Registering Veto Plugin');

	this.on('IS_VTN', function(pkt)
	{
		if (pkt.action == this.insim.VOTE_NONE)
			return;

		if (pkt.ucid == 0)
			return;

		var cancel = new this.insim.IS_TINY;
		cancel.subt = this.insim.TINY_VTC;

		this.send(cancel);
	});
}
