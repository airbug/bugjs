//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStore')

//@Require('Class')
//@Require('HashStoreNode')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var HashStoreNode = bugpack.require('HashStoreNode');
var Obj =           bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HashStore = Class.extend(Obj, {

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
         * @type {Number}
         */
        this.count = 0;

        /**
         * @private
         * @type {Object}
         */
        this.hashStoreNodeObject = {};
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCount: function() {
        return this.count;
    },

    /**
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {
        var valueHashCode = Obj.hashCode(value);
        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
        if (hashStoreNode) {
            return hashStoreNode.getValueCount(value);
        }
        return 0;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    addValue: function(value) {
        var valueHashCode = Obj.hashCode(value);
        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
        if (!hashStoreNode) {
            hashStoreNode = new HashStoreNode();
            this.hashStoreNodeObject[valueHashCode] = hashStoreNode;
        }
        hashStoreNode.addValue(value);
        this.count++;
    },

    /**
     * @param {function(*)} func
     */
    forEach: function(func) {
        for (var valueHashCode in this.hashStoreNodeObject) {
            var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
            hashStoreNode.getValueArray().forEach(function(value) {
                func(value);
            });
        }
    },

    /**
     * @return {Array}
     */
    getValueArray: function() {
        var valueArray = [];
        for (var valueHashCode in this.hashStoreNodeObject) {
            var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
            valueArray = valueArray.concat(hashStoreNode.getValueArray());
        }
        return valueArray;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    hasValue: function(value) {
        var valueHashCode = Obj.hashCode(value);
        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
        if (hashStoreNode) {
            return hashStoreNode.containsValue(value);
        }
        return false;
    },

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return this.count === 0;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    removeValue: function(value) {
        var valueHashCode = Obj.hashCode(value);
        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
        var result = false;
        if (hashStoreNode) {
            result = hashStoreNode.removeValue(value);
            if (result) {
                if (hashStoreNode.getCount() === 0) {
                    delete this.hashStoreNodeObject[valueHashCode];
                }
                this.count--;
            }
        }
        return result;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('HashStore', HashStore);
