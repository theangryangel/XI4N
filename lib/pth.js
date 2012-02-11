"use strict";

(function(exports)
{

var jspack = require('jspack');

/*
lfs to jspack
char : c
byte : B
word : 
float: 4-byte float
 */

var PTHReader = function(file, paths)
{
	this.paths = '';
}

PTHReader.prototype.setPaths = function()
{
}

PTHReader.prototype.load = function(file)
{
}

PTHReader.prototype.toJson = function()
{
}

var PTHWriter = function()
{
}

PTHWriter.prototype.setNodes = function()
{
}

PTHWriter.prototype.write = function()
{
}

exports.reader = PTHReader;
exports.writer = PTHWriter;

exports.createReader = function(file, paths)
{
	return new PTHReader(file, paths);
}

exports.createWriter = function()
{
	return new PTHWriter();
}

}(typeof exports === "undefined"
        ? (this.pth = {})
        : exports));
