
# cli()

 * @api public

 Returns the CLI wrapper, which parses and handles process argument inputs.
 
 ## Example
     var c = new cli();
     c.execute();

# cli.prototype.execute()

 * @api public

 Parses process arguments and executes the corresponding code

# cli.prototype.deployDataAndPlugins()

 * @api private
 * @param {String} source 
 * @param {String} destination 
 * @param {Boolean} force Forces overwrite of destination, if files already exist
 * @param {Boolean} symlink Creates symlinks, rather than copying
 * @param {Function} next Callback to run next

 Copies data and plugins from the global directory into the destination

# cli.prototype.install()

 * @api private
 * @param {Function} next Callback to run next

 Installs (copies) from global into destination

# cli.prototype.update()

 * @api private
 * @param {Function} next Callback to run next

 Updates (copies) from global into destination

# cli.prototype.watch()

 * @api private
 * @param {String} file Target to watch
 * @param {Function} next Callback to run next

 Watches a directory or file and calls a callback

# cli.prototype.load()

 * @api private
 * @param {String} configFile 

 Loads a configuration file

# cli.prototype.merge()

 * @api private
 * @param {Object} obj1 
 * @param {Object} obj2 

 Merges 2 objects together

# cli.prototype.run()

 * @api private
 * @param {Function} next Callback to run after all connections have been lost

 Reads and parses configuration, creates a corresponding clientmanager and
 handles reconnections.

# cli.prototype.log()

 * @api private
 * @param {String} payload 

 Log a string to stdout

# cli.prototype.warn()

 * @api private
 * @param {String} payload 

 Log a string to stderr

# cli.prototype.error()

 * @api private
 * @param {String} payload 

 Log a string to stderr

# exports.create()

 * @api public

 Creates and returns an instance of cli
