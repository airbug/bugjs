//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('StringUtil')

//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil = bugpack.require('TypeUtil');


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
 * @return {string}
 */
StringUtil.pad = function(value, padCharacter, size) {
    // Ensure string
    var result = value + "";
    while (result.length < size) {
        result = padCharacter + result;
    }
    return result;
};

/**
 * @param {string} value
 * @return {string}
 */
StringUtil.trim = function(value) {
    var result = "";
    if (TypeUtil.isFunction(value.trim)) {
        result = value.trim();
    } else {
        result = value.replace(/^\s+|\s+$/g, '');
    }
    return result;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('StringUtil', StringUtil);
