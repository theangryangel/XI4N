#!/usr/bin/env node

var buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk)
{
	buf += chunk;
})
.on('end', function()
{
	var comments = JSON.parse(buf);
	comments.forEach(function(comment)
	{
		if (comment.ignore)
			return;

		if (!comment.ctx)
			return;

		if (!comment.description.full.indexOf('Module dep'))
			return;

		console.log();
		console.log('# %s', comment.ctx.string);
		console.log();

		for (var i = 0; i < comment.tags.length; i++)
		{
			var str = '';

			switch(comment.tags[i].type)
			{
				case 'api':
					str += '@' + comment.tags[i].type;
					str += ' ' + comment.tags[i].visibility;
					break;
				case 'param':
					str += '@' + comment.tags[i].type;
					str += ' {' + comment.tags[i].types.join('|') + '} ' + comment.tags[i].name + ' ' + comment.tags[i].description;
					break;
			}

			if (str.length > 0)
				console.log(' * %s', str);

			if (i == comment.tags.length - 1)
				console.log();
		}

		console.log(comment.description.full.trim().replace(/^/gm, ' '));
	});
})
.resume();
