//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArgUtil')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug     = bugpack.require('ArgumentBug');
var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var ArgUtil = Class.extend(Obj, {});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {*} rawArgs
 * @param {Array.<{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *
 * }>=} descriptions
 * @return {Object}
 */
ArgUtil.process = function(rawArgs, descriptions) {
    var args        = ArgUtil.toArray(rawArgs);
    var argsObject  = {};
    if (!TypeUtil.isArray(descriptions)) {
        throw new ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions, "parameter must be an Array");
    }

    //TODO BRN: Is this something that we want to support? Should we have to declare all args?
    if (args.length > descriptions.length) {
        throw new  ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions,
            "Too few descriptions. Number of descriptions must be equal to or greater than the number of arguments");
    }

    var neededDescriptions = [];
    for (var i = descriptions.length - 1; i >= 0; i--) {
        var description = descriptions[i];
        if (!TypeUtil.isObject(description)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions, "descriptions Array must only contain description objects");
        }
        if (!TypeUtil.isString(description.name)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions, "description objects must have a name");
        }
        if (description.default) {
            argsObject[description.name] = description.default;
        } else {
            argsObject[description.name] = undefined;
        }

        //This arg is not present
        if (i >= args.length) {
            if (!description.optional) {
                neededDescriptions.push(description);
            }
        } else {
            if (!TypeUtil.isUndefined(args[i])) {
                if (neededDescriptions.length > 0) {
                    var neededDescription = neededDescriptions.shift();
                    ArgUtil.setArgOnArgsObject(args[i], argsObject, neededDescription);
                    if (!description.optional) {
                        neededDescriptions.push(description);
                    }
                } else {
                    ArgUtil.setArgOnArgsObject(args[i], argsObject, description);
                }
            } else {
                if (!description.optional) {
                    neededDescriptions.push(description);
                }
            }
        }
    }
    if (neededDescriptions.length > 0) {
        var missingDescription = neededDescriptions[0];
        throw new ArgumentBug(ArgumentBug.ILLEGAL, missingDescription.name, undefined, "argument missing");
    }
    return argsObject;
};

/**
 * @static
 * @param {*} rawArgs
 * @return {Array.<*>}
 */
ArgUtil.toArray = function(rawArgs) {
    return Array.prototype.slice.call(rawArgs, 0);
};


/**
 * @static
 * @private
 * @param {*} arg
 * @param {Object} argsObject
 * @param {{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *
 * }} description
 */
ArgUtil.setArgOnArgsObject = function(arg, argsObject, description) {
    if (description.type) {
        var type        = TypeUtil.toType(arg);
        var validType   = true;
        if (TypeUtil.isArray(description.type)) {
            validType = (description.type.indexOf(type) >= 0);
        } else {
            validType = (type === description.type);
        }
        if (!validType) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, description.name, arg, "argument type does not match. Must be of type '" + description.type + "'");
        }
    }
    argsObject[description.name] = arg;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ArgUtil', ArgUtil);
