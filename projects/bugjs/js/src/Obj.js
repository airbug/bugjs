//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Obj')

//@Require('Class')
//@Require('HashUtil')
//@Require('IdGenerator')
//@Require('IHashCode')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Obj = Class.declare({

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

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
    getId: function() {
        return this._internalId;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    clone: function() {
        var classObject = this.getClass();
        var cloneObject = new classObject();
        for (var key in this) {
            var value = this[key];
            if (!TypeUtil.isFunction(value)) {
                cloneObject[key] = value;
            }
        }
        return cloneObject;
    },

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
Class.implement(Obj, IHashCode);


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {*} value1
 * @param {*} value2
 * @return {boolean}
 */
Obj.equals = function(value1, value2) {
    if (Class.doesExtend(value1, Obj)) {
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
