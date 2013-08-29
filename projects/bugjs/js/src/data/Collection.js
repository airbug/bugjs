/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/interface_goog_structs_Collection.html
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collection')

//@Require('Class')
//@Require('CollectionIterator')
//@Require('HashStore')
//@Require('IArrayable')
//@Require('IIterable')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var CollectionIterator  = bugpack.require('CollectionIterator');
var HashStore           = bugpack.require('HashStore');
var IArrayable          = bugpack.require('IArrayable');
var IIterable           = bugpack.require('IIterable');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Collection = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {(Collection.<*> | Array.<*>)} items
     */
    _constructor: function(items) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {HashStore}
         */
        this.hashStore = new HashStore();


        //-------------------------------------------------------------------------------
        // Add Arguments to HashStore
        //-------------------------------------------------------------------------------

        if (items) {
            this.addAll(items);
        }
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
     * @return {Array.<*>}
     */
    getValueArray: function() {
        return this.hashStore.getValueArray();
    },

    /**
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {
        return this.hashStore.getValueCount(value);
    },


    //-------------------------------------------------------------------------------
    // IArrayable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return (Array)
     */
    toArray: function() {
        return this.getValueArray();
    },


    //-------------------------------------------------------------------------------
    // IIterable Implementation
    //-------------------------------------------------------------------------------

    /**
     * NOTE BRN: Because of the way javascript works and the current lack of Iterator support across browsers. Iterators
     * create a snap shot of the values in the Collection before starting the iteration process. If a value is modified
     * in one iteration and then visited at a later time, its value in the loop is its value when the iteration was
     * started. A values that is deleted before it has been visited WILL be visited later.
     * Values added to the Collection over which iteration is occurring will be omitted from iteration.
     *
     * @return {IIterator}
     */
    iterator: function() {
        return new CollectionIterator(this);
    },


    //-------------------------------------------------------------------------------
    // Obj Extensions
    //-------------------------------------------------------------------------------

    /**
     * @return {Collection.<*>}
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
     * @param {(Collection.<*>|Array.<*>)} items
     */
    addAll: function(items) {
        if (Class.doesExtend(items, Collection) || TypeUtil.isArray(items)) {
            var _this = this;
            items.forEach(function(value) {
                _this.add(value);
            });
        } else {
            throw new Error("'items' must be an instance of Collection or Array");
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
     * @param {(Collection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsAll: function(items) {
        if (Class.doesExtend(items, Collection) || TypeUtil.isArray(items)) {
            var valueArray = items;
            if (Class.doesExtend(items, Collection)) {
                valueArray = items.getValueArray();
            }
            for (var i = 0, size = valueArray.length; i < size; i++) {
                var value = valueArray[i];
                if (!this.contains(value)) {
                    return false;
                }
            }
            return true;
        } else {
            throw new Error("'items' must be an instance of Collection or Array");
        }
    },

    /**
     * @param {(Collection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsEqual: function(items) {
        if (TypeUtil.isArray(items)) {
            items = new Collection(items);
        }
        if (Class.doesExtend(items, Collection)) {
            if (items.getCount() === this.getCount()) {
                var collectionValueArray = this.getValueArray();
                for (var i1 = 0, size1 = collectionValueArray.length; i1 < size1; i1++) {
                    var collectionValue = collectionValueArray[i1];
                    if (this.getValueCount(collectionValue) !== items.getValueCount(collectionValue)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        } else {
            throw new Error("'items' must be an instance of Collection or Array");
        }
    },

    /**
     * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
     * its value at that later time. A value that is deleted before it has been visited will not be visited later.
     * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
     * In general it is best not to add, modify or remove values from the Collection during iteration, other than the
     * value currently being visited. There is no guarantee whether or not an added value will be visited, whether
     * a modified value (other than the current one) will be visited before or after it is modified, or whether a
     * deleted value will be visited before it is deleted.
     *
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
     * @param {Collection} collection
     */
    merge: function(collection) {
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
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {
        return this.hashStore.removeValue(value);
    },

    /**
     * @param {(Collection.<*> | Array.<*>)} items
     */
    removeAll: function(items) {
        if (Class.doesExtend(items, Collection) || TypeUtil.isArray(items)) {
            var _this = this;
            items.forEach(function(value) {
                _this.remove(value);
            });
        } else {
            throw new Error("collection must be an instance of Collection");
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Collection, IArrayable);
Class.implement(Collection, IIterable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Collection', Collection);
