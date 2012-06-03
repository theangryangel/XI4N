
# exports._chunkToUTF8()

 * @api private
 * @param {String} str String to convert
 * @param {String} from Source string character codepage

 Converts a chunk of data into utf8, from a provided codepage. This is
 designed to be used by toUTF8 exclusively.

# exports.toUTF8()

 * @api public
 * @param {String} str 

 Converts a string into utf8. It auto detects the relevant codepages, as there
 may be multiple in a provided string.

# exports.translateSpecials()

 * @api public
 * @param {String} str Input string

 Converts special characters into their utf8 equivilent - such as ^^ = ^, ^v =
 | and so forth.

# exports.remColours()

 * @api public
 * @param {String} str Input string

 Strips colour codes from an input string
