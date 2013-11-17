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
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?number}
         */
        this._hashCode = undefined;

        // NOTE BRN: This value is set during the call to IdGenerator.injectId(). We just put this here for clarity's sake.

        /**
         * @private
         * @type {?number}
         */
        this._internalId = undefined;

        IdGenerator.ensureId(this);
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


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Obj, IClone);
Class.implement(Obj, IEquals);
Class.implement(Obj, IHashCode);


//-------------------------------------------------------------------------------
// Static Private Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {boolean}
 */
Obj.isDontEnumSkipped = true;

// test if properties that shadow DontEnum ones are enumerated
for (var prop in { toString: true }) {
    Obj.isDontEnumSkipped = false;
}

/**
 * @static
 * @private
 * @type {Array}
 */
Obj.dontEnumProperties = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'
];

/**
 * @static
 * @private
 * @type {function()}
 */
Obj.hasOwnProperty = Object.prototype.hasOwnProperty;


//-------------------------------------------------------------------------------
// Static Public Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {Object} value
 * @param {boolean} deep
 * @return {{*}}
 */
Obj.clone = function(value, deep) {
    var clone = null;
    if (TypeUtil.isObject(value)) {
        if (Class.doesImplement(value, IClone)) {
            clone = value.clone(deep);
        } else {
            clone = {};
            Obj.forIn(value, function(propertyName, propertyValue) {
                if (deep) {
                    clone[propertyName] = Obj.clone(propertyValue, deep);
                } else {
                    clone[propertyName] = propertyValue;
                }
            });
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
 * @license MIT License
 * This work is based on the code found here
 * https://github.com/kangax/protolicious/blob/master/experimental/object.for_in.js#L18
 *
 * NOTE BRN: If a property is modified in one iteration and then visited at a later time, its value in the loop is
 * its value at that later time. A property that is deleted before it has been visited will not be visited later.
 * Properties added to the object over which iteration is occurring may either be visited or omitted from iteration.
 * In general it is best not to add, modify or remove properties from the object during iteration, other than the
 * property currently being visited. There is no guarantee whether or not an added property will be visited, whether
 * a modified property (other than the current one) will be visited before or after it is modified, or whether a
 * deleted property will be visited before it is deleted.
 *
 * @static
 * @param {Object} object
 * @param {function(*)} func
 * @param {Object} context
 */
Obj.forIn = function(object, func, context) {
    if (!func || (func && !func.call)) {
        throw new TypeError('Iterator function is required');
    }

    for (var propertyName in object) {
        if (Obj.hasProperty(object, propertyName)) {
            func.call(context || func, propertyName, object[propertyName]);
        }
    }

    if (Obj.isDontEnumSkipped) {
        for (var i = 0, size = Obj.dontEnumProperties.length; i < size; i++) {
            var dontEnumPropertyName = Obj.dontEnumProperties[i];
            if (Obj.hasProperty(object, dontEnumPropertyName)) {
                func.call(context || func, dontEnumPropertyName, object[dontEnumPropertyName]);
            }
        }
    }
};

/**
 * @static
 * @param {Object} object
 * @param {string} propertyName
 */
Obj.getProperty = function(object, propertyName) {
    if (Obj.hasProperty(object, propertyName)) {
        return object[propertyName];
    }
    return undefined;
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

/**
 * @static
 * @param {Object} object
 * @param {string} propertyName
 */
Obj.hasProperty = function(object, propertyName) {
    return Obj.hasOwnProperty.call(object, propertyName)
};

Obj.getProperties = function() {
    //TODO BRN: Test for Object.prototype.keys. If it exists, then use it, otherwise, use our own function

};

/**
 * @param {*} value
 * @return {Iterator}
 */
Obj.iterator = function(value) {
    //TODO BRN: return the correct iterator for the given value. If not an iterable type, then throw an error
};

//TODO BRN: Think through this function a bit. Should the from object be cloned?
/**
 * @param {*} from
 * @param {*} into
 */
Obj.merge = function(from, into) {
    if (TypeUtil.isObject(from) && TypeUtil.isObject(into)) {
        Obj.forIn(from, function(prop, value) {
            into[prop] = from[prop];
        });
    } else {
        throw new Error("both from and into parameters must be objects");
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Obj', Obj);
