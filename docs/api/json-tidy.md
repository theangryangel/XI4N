
# exports.tidyParseString()

 * @param {String} str String that gets cleaned and turned into a JSON parsed
 * @api public

 Takes a string, attempts to remove anything that prevents a string from being
 parsed by JSON.parse. 
   * Removes commented out lines
   * Replaces single quotes with double quotes
   * Removes any mis-placed commas

# exports.tidyParseFile()

 * @param {String} dst File path
 * @param {String} [encoding] File encoding, defaults to utf8
 * @api public

 Reads in a file and passes it through tidyParseString()
