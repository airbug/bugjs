/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/interface_goog_structs_Collection.html
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collection')

//@Require('Class')
//@Require('HashStore')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var HashStore = bugpack.require('HashStore');
var Obj =       bugpack.require('Obj');


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
        return this.hashStore.getCount();
    },

    /**
     * @return {Array}
     */
    getValueArray: function() {
        var valueArray = [];
        return valueArray.concat(this.hashStore.getValueArray());
    },

    /**
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {
        return this.hashStore.getValueCount(value);
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


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    add: function(value) {
        this.hashStore.addValue(value);
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
            var collectionValueArray = collection.getValueArray();
            for (var i = 0, size = collectionValueArray.length; i < size; i++) {
                var collectionValue = collectionValueArray[i];
                if (!this.contains(collectionValue)) {
                    return false;
                }
            }
            return true;
        } else {
            throw new Error("collection must be an instance of Collection");
        }
    },

    /**
     * @param {Collection} collection
     * @return {boolean}
     */
    containsEqual: function(collection) {
        if (Class.doesExtend(collection, Collection)) {
            if (collection.getCount() === this.getCount()) {
                var collectionValueArray = this.getValueArray();
                for (var i = 0, size = collectionValueArray.length; i < size; i++) {
                    var collectionValue = collectionValueArray[i];
                    if (this.getValueCount(collectionValue) !== collection.getValueCount(collectionValue)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
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
        return this.hashStore.isEmpty();
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {
        return this.hashStore.removeValue(value);
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

bugpack.export('Collection', Collection);
