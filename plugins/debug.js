exports.init = function()
{
	this.log.info('Registering Veto Plugin');

	this.client.on('state:connnew', function(ucid)
	{
		var c = this.client.state.getConnByUcid(ucid);

		console.log('CONN: ');
		console.log(c);
		console.log();
	});

	this.client.on('state:plyrnew', function(plid)
	{
		var p = this.client.state.getPlyrByPlid(plid);

		console.log('PLYR: ');
		console.log(p);
		console.log();
	});

}

