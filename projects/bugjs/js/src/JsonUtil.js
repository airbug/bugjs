//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('JsonUtil')

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

var JsonUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

//TODO BRN: Redo this file. Should restrict all objects to JSON specifically and not handle class objects.
//Instead, should provide a method for converting class objects to JSON and then back.

/**
 * This method works recursively through objects and arrays
 * @param {*} from
 * @param {*} into
 */
/*JsonUtil.munge = function(from, into) {
    if (TypeUtil.isObject(from) && TypeUtil.isObject(into)) {
        for (var fromName in from) {
            var fromValue = from[fromName];
            var intoValue = into[fromName];
            if (TypeUtil.isObject(fromValue) && TypeUtil.isObject(intoValue)) {
                into[fromName] = JsonUtil.merge(fromValue, intoValue);
            } else {
                into[fromName] = fromValue;
            }
        }
    } else {
        throw new Error("both from and into parameters must be objects");
    }
};*/

/**
 * Merges the first object in to the second object, the second object into the third, etc.
 * None of the objects passed to this function are modified. Instead a new object is created that is a merge of all the
 * objects passed to this function. All data is cloned during this process, so no modifications
 * @param {...Object} var_args
 * @return {Object}
 */
/*JsonUtil.merge = function() {
    var args = arguments;
    var result = {};
    for (var size = args.length, i = size -1; i >= 0; i--) {
        var json = JsonUtil.clone(args[i]);
        JsonUtil.munge(json, result);
    }
    return result;
};*/


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('JsonUtil', JsonUtil);
