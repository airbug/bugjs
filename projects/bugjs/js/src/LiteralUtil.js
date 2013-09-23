//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('LiteralUtil')

//@Require('Class')
//@Require('IArrayable')
//@Require('IObjectable')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IArrayable      = bugpack.require('IArrayable');
var IObjectable     = bugpack.require('IObjectable');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LiteralUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

LiteralUtil.convertToLiteral = function(value) {
    var literal = undefined;
    if (TypeUtil.isObject(value)) {
        if (TypeUtil.toType(value) === "Object") {
            literal = {};
            Obj.forIn(value, function(propertyName, propertyValue) {
                literal[propertyName] = LiteralUtil.convertToLiteral(propertyValue);
            });
        } else {
            if (Class.doesImplement(value, IObjectable)) {
                literal = value.toObject();
            } else if (Class.doesImplement(value, IArrayable)) {
                literal = value.toArray();
            } else {
                throw new Error("Cannot marshal complex object:", value);
            }
        }
    } else if (TypeUtil.isArray(value)) {
        literal = [];
        for (var i = 0, size = value.length; i < size; i++) {
            var arrayValue = value[i];
            literal.push(LiteralUtil.convertToLiteral(arrayValue));
        }
    } else {
        //TODO BRN: Any basic types that need to be marshalled?
        literal = value;
    }
    return literal
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('LiteralUtil', LiteralUtil);
