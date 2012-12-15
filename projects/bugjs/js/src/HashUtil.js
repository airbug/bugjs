//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('HashUtil')

//@Require('IdGenerator')
//@Require('TypeUtil')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var IdGenerator = bugpack.require('IdGenerator');
var TypeUtil = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
// and Class depends on Object. Thus, if this class depends on Class it creates s circular dependency.

var HashUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {*} value
 * @return {number}
 * speed: O(1)
 */
HashUtil.hash = function(value) {
    var key = "";
    if (TypeUtil.isArray(value)) {
        IdGenerator.ensureId(value);
        key += "a_" + value._internalId;
    } else if (TypeUtil.isBoolean(value)) {
        key += "b_" + value;
    } else if (TypeUtil.isFunction(value)) {
        IdGenerator.ensureId(value);
        key += "f_" + value._internalId;
    } else if (TypeUtil.isNumber(value)) {
        key += "n_" + value;
    } else if (TypeUtil.isNull(value)) {
        key += "null";
    } else if (TypeUtil.isObject(value)) {
        IdGenerator.ensureId(value);
        key += "o_" + value._internalId;
    } else if (TypeUtil.isString(value)) {
        key += "s_" + value;
    } else if (TypeUtil.isUndefined(value)) {
        key += "undefined";
    }
    else {
        throw new Error("Unrecognized type to hash: " + value);
    }

    var hash = 0;
    if (key.length == 0) {
        return hash;
    }
    for (var i = 0; i < key.length; i++) {
        var char = key.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(HashUtil);
