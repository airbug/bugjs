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
 * @return {string}
 */
StringUtil.capitalize = function(string){
    var strings = string.split(" ");
    var result;
    if(strings.map){
        result = strings.map(function(string, index, array){
            return string[0].toUpperCase() + string.substring(1);
        });
    } else {
        result = [];
        strings.forEach(function(string){
            result.push(string[0].toUpperCase() + string.substring(1));
        });
    }
    return result.join(" ");
};

/**
 * @param {string} value
 * @param {string} pad
 * @param {number} size
 * @return {string}
 */
StringUtil.pad = function(value, pad, size) {
    // Ensure string
    var result = value + "";
    while (result.length < size) {
        result = pad + result;
    }
    return result;
};

/**
 * @param {string} value
 * @return {string}
 */
StringUtil.pluralize = function(string){
        //TODO also add irregular patterns
        var irregularPlurals = {};
        if(irregularPlurals[string]){
            return irregularPlurals[string]
        } else {
            return string + "s";
        }
},

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

/**
 * @param {string} value
 * @return {string}
 */
StringUtil.uncapitalize = function(string){
    var strings = string.split(" ");
    var result;
    if(strings.map){
        result = strings.map(function(string, index, array){
            return string[0].toLowerCase() + string.substring(1);
        });
    } else {
        result = [];
        strings.forEach(function(string){
            result.push(string[0].toLowerCase() + string.substring(1));
        });
    }
    return result.join(" ");
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('StringUtil', StringUtil);
