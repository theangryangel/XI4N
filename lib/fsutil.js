"use strict";

var fs = require('fs'),
	path = require('path'),
	os = require('os');

(function(exports)
{

exports.mkdir = function(dst, force)
{
	try
	{
		fs.mkdirSync(dst, fs.statSync(__dirname).mode);
	}
	catch (e)
	{
		// File exists
		if (e.errno = 17)
		{
			if (!force)
			{
				console.warn();
				console.warn("  warn: exception whilst creating '%s' - '%s'", dst, e.message);
				console.warn();
			}
		}
		else
		{
			throw e;
		}
	}
};

exports.copydir = function(src, dst, force, symlink)
{
	if (symlink)
	{
		fs.symlinkSync(src, dst, 'directory');
		return;
	}

	exports.mkdir(dst, force);
	var files = fs.readdirSync(src);

	for(var i = 0; i < files.length; i++)
	{
		// Ignore dot files
		// TODO: Add windows hidden file support
		if (/^\./.test(files[i]))
			continue;

		var srcFile = path.join(src, files[i]);
		var dstFile = path.join(dst, files[i]);

		var srcStat = fs.statSync(srcFile);

		// Recursive call If direcotory
		if (srcStat.isDirectory())
			exports.copydir(srcFile, dstFile, force);

		// Copy to dstPath if file
		else if (srcStat.isFile())
			exports.copyfile(srcFile, dstFile, force);
	}
};

exports.mkfile = function (dst, data, force)
{
	try
	{
		if (path.existsSync(dst) && !force)
			throw filePath + " already exists";

		var fd = fs.openSync(dst, 'w');
		fs.writeSync(fd, data);
		fs.close(fd);
	}
	catch (e)
	{
		console.error();
		console.error("  error: unable to create file '%s'", file);
		console.error();
	}
};

exports.copyfile = function (src, dst, force, symlink)
{
	if (path.existsSync(dst) && !force)
	{
		console.error();
		console.error("  error: failed to copy '%s' to '%s' - already exists", src, dst);
		console.error();
		return;
	}

	if (symlink)
	{
		fs.symlinkSync(src, dst, 'file');
		return;
	}

	var data = fs.readFileSync(src);
	fs.writeFileSync(dst, data);
};

}(typeof exports === "undefined"
		? (this.insim = {})
		: exports));
