//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Pair')

//@Require('Class')
//@Require('IArrayable')
//@Require('IObjectable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IArrayable          = bugpack.require('IArrayable');
var IObjectable         = bugpack.require('IObjectable');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Pair = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {*} a
     * @param {*} b
     */
    _constructor: function(a ,b) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.a  = a;

        /**
         * @private
         * @type {*}
         */
        this.b  = b;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getA: function() {
        return this.a;
    },

    /**
     * @return {*}
     */
    getB: function() {
        return this.b;
    },


    //-------------------------------------------------------------------------------
    // IArrayable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Array.<*>}
     */
    toArray: function() {
        return [
            this.a,
            this.b
        ];
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Object}
     */
    toObject: function() {
        return {
            a: this.a,
            b: this.b
        };
    },

    //-------------------------------------------------------------------------------
    // Obj Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {Pair}
     */
    clone: function(deep) {
        var a = deep ? Obj.clone(this.a, deep) : this.a;
        var b = deep ? Obj.clone(this.b, deep) : this.b;
        return new Pair(a, b);
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Pair)) {
            return Obj.equals(value.getA(), this.a) && Obj.equals(value.getB(), this.b);
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[Pair]" + Obj.hashCode(this.a) + Obj.hashCode(this.b));
        }
        return this._hashCode;
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "";
        output += "[Pair] {\n";
        output += "  a: " + this.a + ",\n";
        output += "  b: " + this.b + ",\n";
        output += "}\n";
        return output;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    contains: function(value) {
        return Obj.equals(value, this.a) || Obj.equals(value, this.b);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Pair, IArrayable);
Class.implement(Pair, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Pair', Pair);
