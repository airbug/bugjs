/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/interface_goog_structs_Collection.html
 */

//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Collection')

//@Require('Class')
//@Require('HashStore')
//@Require('Obj')


var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('Collection');

var Class = bugpack.require('Class');
var HashStore = bugpack.require('HashStore');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Collection = Class.extend(Obj, {

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
         * @type {HashStore}
         */
        this.hashStore = new HashStore();
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
     * @return {Array}
     */
    getValueArray: function() {
        var valueArray = [];
        return valueArray.concat(this.hashStore.getValueArray());
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Collection}
     */
    clone: function() {
        var cloneCollection = new Collection();
        cloneCollection.addAll(this);
        return cloneCollection;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Collection)) {
            if (value.getCount() === this.getCount()) {
                var collectionValueArray = this.getValueArray();
                for (var i = 0, size = collectionValueArray.length; i < size; i++) {
                    var collectionValue = collectionValueArray[i];
                    if (!value.contains(collectionValue)) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    add: function(value) {
        this.hashStore.addValue(value);
        this.count++;
    },

    /**
     * @param {Collection} collection
     */
    addAll: function(collection) {
        if (Class.doesExtend(collection, Collection)) {
            var _this = this;
            collection.forEach(function(value) {
                _this.add(value);
            });
        } else {
            throw new Error("collection must be an instance of Collection");
        }
    },

    /**
     *
     */
    clear: function() {
        this.count = 0;
        this.hashStore = new HashStore();
    },


    /**
     * @param {*} value
     * @return {boolean}
     */
    contains: function(value) {
        return this.hashStore.hasValue(value);
    },

    /**
     * Multiple elements are ignored in this function.
     * e.g. Collection[0,1] containsAll Collection[0,1,1,1] is true
     * If you want to check for exact equality, use the equals function.
     * Empty collections are always contained by another collection
     * e.g. Collection[0,1] containsAll Collection[] is true
     * @param {Collection} collection
     * @return {boolean}
     */
    containsAll: function(collection) {
        if (Class.doesExtend(collection, Collection)) {
            collection.forEach(function(value) {
                if (!this.contains(value)) {
                    return false;
                }
            });
            return true;
        } else {
            throw new Error("collection must be an instance of Collection");
        }
    },

    /**
     * @param {function(*)} func
     */
    forEach: function(func) {
        this.hashStore.forEach(func);
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
    remove: function(value) {
        var result = this.hashStore.removeValue(value);
        if (result) {
            this.count--;
        }
        return result;
    },

    /**
     * @param {Collection} collection
     */
    removeAll: function(collection) {
        if (Class.doesExtend(collection, Collection)) {
            var _this = this;
            collection.forEach(function(value) {
                _this.remove(value);
            });
        } else {
            throw new Error("collection must be an instance of Collection");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(Collection);
