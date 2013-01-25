//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Obj')

//@Require('Class')
//@Require('HashUtil')
//@Require('IClone')
//@Require('IdGenerator')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var HashUtil =      bugpack.require('HashUtil');
var IClone =        bugpack.require('IClone');
var IdGenerator =   bugpack.require('IdGenerator');
var IEquals =       bugpack.require('IEquals');
var IHashCode =     bugpack.require('IHashCode');
var TypeUtil =      bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Obj = Class.declare({

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this._hashCode = undefined;

        // NOTE BRN: This value is set during the call to IdGenerator.injectId(). We just put this here for clarity's sake.

        /**
         * @private
         * @type {number}
         */
        this._internalId = undefined;

        IdGenerator.injectId(this);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getInternalId: function() {
        return this._internalId;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        var classObject = this.getClass();
        var cloneObject = new classObject();
        for (var key in this) {
            var value = this[key];
            if (!TypeUtil.isFunction(value)) {
                if (deep) {
                    cloneObject[key] = Obj.clone(value, deep);
                } else {
                    cloneObject[key] = value;
                }
            }
        }
        return cloneObject;
    },


    //-------------------------------------------------------------------------------
    // IEquals Implementation
    //-------------------------------------------------------------------------------

    /**
     * If two Objs are equal then they MUST return the same hashCode. Otherwise the world will end!
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (value !== null && value !== undefined) {
            return (value._internalId === this._internalId);
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // IHashCode Implementation
    //-------------------------------------------------------------------------------

    /**
     * Equal hash codes do not necessarily guarantee equality.
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = HashUtil.hash(this);
        }
        return this._hashCode;
    }
});
Class.implement(Obj, IClone);
Class.implement(Obj, IEquals);
Class.implement(Obj, IHashCode);


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {Object} value
 * @param {boolean} deep
 */
Obj.clone = function(value, deep) {
    var clone = null;
    if (TypeUtil.isObject(value)) {
        if (TypeUtil.toType(value) === "Object") {
            clone = {};
            for (var propName in value) {
                var propValue = value[propName];
                if (deep) {
                    clone[propName] = Obj.clone(propValue, deep);
                } else {
                    clone[propName] = propValue;
                }
            }
        } else if (Class.doesImplement(value, IClone)) {
            clone = value.clone(deep);
        } else {
            // The value is not a generic object and does not implement the IClone interface. What do we do here?
            // NOTE BRN: Leaving this blank for now since an undefined is easier to diagnose then a clone function not
            // returning an actual clone.
        }
    } else if (TypeUtil.isArray(value)) {
        clone = [];
        for (var i = 0, size = value.length; i < size; i++) {
            var arrayValue = value[i];
            if (deep) {
                clone.push(Obj.clone(arrayValue, deep));
            } else {
                clone.push(arrayValue);
            }
        }
    } else {
        //TODO BRN: Any basic types that need to be cloned?
        clone = value;
    }
    return clone;
};

/**
 * @static
 * @param {*} value1
 * @param {*} value2
 * @return {boolean}
 */
Obj.equals = function(value1, value2) {
    if (Class.doesImplement(value1, IEquals)) {
        return value1.equals(value2);
    }
    return value1 === value2;
};

/**
 * @static
 * @param {*} value
 * @return {number}
 */
Obj.hashCode = function(value) {
    if (Class.doesImplement(value, IHashCode)) {
        return value.hashCode();
    } else {
        return HashUtil.hash(value);
    }
};

//TODO BRN: Think through this function a bit. Should the from object be cloned?
/**
 * @param {*} from
 * @param {*} into
 */
Obj.merge = function(from, into) {
    if (TypeUtil.isObject(from) && TypeUtil.isObject(into)) {
        for (var fromName in from) {
            into[fromName] = from[fromName];
        }
    } else {
        throw new Error("both from and into parameters must be objects");
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Obj', Obj);
