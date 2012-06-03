"use strict";

(function(exports)
{

/**
 * Module dependencies.
 */
var fs = require('fs'),
	path = require('path'),
	os = require('os');

/**
 * Creates a directory
 *
 * @param {String} dst Destination
 * @param {Boolean} force
 * @api public
 */
exports.mkdir = function(dst, force)
{
	try
	{
		fs.mkdirSync(dst, fs.statSync(__dirname).mode);
	}
	catch (e)
	{
		if ((e.errno = 17) && (!force))
		{
			// file exists and no force
			return -1;
		}
		else
		{
			// unknown error, re-throw the exception
			throw e;
			return -1;
		}
	}

	return 0;
};

/**
 * Copies a directory
 *
 * @param {String} src Source to copy from
 * @param {String} dst Destination to copy to
 * @param {Boolean} force
 * @param {Booleab} symlink If true a symlink is created
 * @api public
 */
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

	return 0;
};

/**
 * Creates a file
 *
 * @param {String} dst Destination
 * @param {String} data Data to insert into the file
 * @param {Boolean} force
 * @api public
 */
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
		return -1;
	}

	return 0;
};

/**
 * Copies a file from src to dst
 *
 * @param {String} src Source
 * @param {String} dst Destination
 * @param {Boolean} force
 * @param {Boolean} symlink Create a symlink, rather than copy
 * @api public
 */
exports.copyfile = function (src, dst, force, symlink)
{
	if (path.existsSync(dst) && !force)
	{
		// already exists, no force
		return -1;
	}

	if (symlink)
	{
		fs.symlinkSync(src, dst, 'file');
		return 0;
	}

	var data = fs.readFileSync(src);
	return fs.writeFileSync(dst, data);
};

}(typeof exports === "undefined"
		? (this.insim = {})
		: exports));
