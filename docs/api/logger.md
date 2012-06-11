
# Logger()

 * @param {Object} options Options object
 * @api public

 Creates a logger instance

# Logger.prototype.setLevel()

 * @param {String|Number} level Log level, may be a string or number
 * @api public

 Sets the logging level

# Logger.prototype.log()

 * @param {Number} level 
 * @param {String|Function} message 
 * @api private

 Logs a string, at a given level

# Logger.prototype.write()

 * @param {String} dst Destination
 * @param {Boolean} force 
 * @api private

 Writes a log message to the log stream. This may be any writable stream -
 such as a file or a stdout/stderr

# Logger.prototype.define()

 * @param {Object} logger Instance of a logger
 * @param {Number} level Log level
 * @api private

 Creates a logging function for a given level

# Logger.prototype.name2stream()

 * @param {String} name 
 * @api private

 Converts a "name" to a stream. It matches stdout, stderr, or otherwise
 assumes it's a file.

# Logger.prototype.merge()

 * @param {Object} defaults 
 * @param {Object} options 
 * @api private

 Merges 2 objects

# exports.create()

 * @param {Object} [options] 
 * @api public

 Returns an instance of logger
