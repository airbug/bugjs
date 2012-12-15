//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('JsonUtil')

//@Require('TypeUtil')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var JsonUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------


/**
 * This method works recursively through objects and arrays
 * @param {*} from
 * @param {*} into
 */
JsonUtil.munge = function(from, into) {
    if (TypeUtil.isObject(from) && TypeUtil.isObject(into)) {
        for (var fromName in from) {
            var fromValue = from[fromName];
            var intoValue = into[fromName];
            if ((TypeUtil.isObject(fromValue) && TypeUtil.isObject(intoValue)) ||
                (TypeUtil.isArray(fromValue) && TypeUtil.isArray(intoValue))) {
                into[fromName] = TypeUtil.merge(fromValue, intoValue);
            } else {
                into[fromName] = fromValue;
            }
        }
    } else if (TypeUtil.isArray(from) && TypeUtil.isArray(into)) {
        //TODO BRN
    }
};

/**
 * @param {Object} value
 */
JsonUtil.clone = function(value) {
    var clone = null;
    if (TypeUtil.isObject(value)) {
        clone = {};
        for (var propName in value) {
            var propValue = value[propName];
            if (TypeUtil.isObject(propValue) || TypeUtil.isArray(propValue)) {
                clone[propName] = JsonUtil.clone(propValue);
            } else {
                clone[propName] = propValue;
            }
        }
    } else if (TypeUtil.isArray(value)) {
        clone = [];
        for (var i = 0, size = value.length; i < size; i++) {
            var arrayValue = value[i];
            if (TypeUtil.isObject(arrayValue) || TypeUtil.isArray(arrayValue)) {
                clone.push(JsonUtil.clone(arrayValue));
            } else {
                clone.push(arrayValue);
            }
        }
    }
    return clone;
};

/**
 * @param {...Object} var_args
 * @return {Object}
 */
JsonUtil.merge = function() {
    var args = arguments;
    var result = {};
    for (var size = args.length, i = size -1; i >= 0; i--) {
        var json = JsonUtil.clone(args[i]);
        JsonUtil.munge(json, result);
    }
    return result;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(JsonUtil);