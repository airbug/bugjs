//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('StringUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var StringUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {string} value
 * @param {char} padCharacter
 * @param {number} size
 * @return {String}
 */
StringUtil.pad = function(value, padCharacter, size) {
    // Ensure string
    var result = value+"";
    while (result.length < size) {
        result = padCharacter + result;
    }
    return result;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('StringUtil', StringUtil);
