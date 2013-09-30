//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('List')

//@Require('Class')
//@Require('Collection')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Collection  = bugpack.require('Collection');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var List = Class.extend(Collection, {

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
         * @type {Array.<*>}
         */
        this.valueArray = [];


        if (items) {
            this.addAll(items);
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Array} Array is in the same order as the list
     */
    getValueArray: function() {
        return Obj.clone(this.valueArray);
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {List}
     */
    clone: function(deep) {
        var cloneList = new List();
        if(deep){
            this.forEach(function(item){
                cloneList.add(Obj.clone(item, true));
            });
        } else {
            cloneList.addAll(this);
        }
        return cloneList;
    },


    //-------------------------------------------------------------------------------
    // Extended Collection Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    add: function(value) {
        this._super(value);
        this.valueArray.push(value);
    },

    /**
     *
     */
    clear: function() {
        this._super();
        this.valueArray = [];
    },

    /**
     * @override
     * @param {function(*, number)} func
     */
    forEach: function(func) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            func(this.valueArray[i], i);
        }
    },

    /**
     * Removes the FIRST occurrence of value from the list
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {
        if (this.contains(value)) {
            var index = this.indexOfFirst(value);
            this.removeAt(index);
            return true;
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {number} index
     * @param {*} value
     */
    addAt: function(index, value) {

        // NOTE BRN: The index can be less than OR EQUAL TO the count. If equal to the count, we are adding values to
        // the very end of the list.

        if (index <= this.getCount()) {
            this.hashStore.addValue(value);
            this.valueArray.splice(index, 0, value);
        } else {
            throw new Error("Index out of bounds");
        }
    },

    /**
     * @param {number} index
     * @param {(Collection.<*> | Array.<*>)} items
     */
    addAllAt: function(index, items) {
        if (Class.doesExtend(items, Collection) || TypeUtil.isArray(items)) {
            var insertingIndex = index;
            var _this = this;
            items.forEach(function(value) {
                _this.addAt(insertingIndex, value);

                // NOTE BRN: We increment the inserting index so that the collection is inserted in the correct order.

                insertingIndex++;
            });
        } else {
            throw new Error("'items' must be an instance of Collection or Array");
        }
    },

    /**
     * @param {number} index
     * @return {*}
     */
    getAt: function(index) {
        if (index < this.getCount()) {
            return this.valueArray[index];
        } else {
            throw new Error("Index out of bounds");
        }
    },

    /**
     * @param {*} value
     * @return {number}
     */
    indexOfFirst: function(value) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            if (Obj.equals(this.valueArray[i], value)) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @param {*} value
     * @return {number}
     */
    indexOfLast: function(value) {
        for (var size = this.valueArray.length, i = size - 1; i >= 0; i--) {
            if (Obj.equals(this.valueArray[i], value)) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @param {number} index
     * @return {*} The removed value
     */
    removeAt: function(index) {
        var value = this.getAt(index);
        var result = this.hashStore.removeValue(value);
        if (result) {
            this.valueArray.splice(index, 1);
        }
        return value;
    },

    /**
     * @param {number} index
     * @param {*} value
     */
    set: function(index, value) {
        this.removeAt(index);
        this.addAt(index, value);
    },

    /**
     * @param {number} fromIndex
     * @param {number} toIndex
     * @return {List.<*>}
     */
    subList: function(fromIndex, toIndex) {
        if (!TypeUtil.isNumber(toIndex)) {
            toIndex = this.getCount();
        }
        if (fromIndex < 0 || fromIndex > toIndex || toIndex > this.getCount()) {
            throw new Error("Index out of bounds");
        }
        var subList = new List();
        for (var i = fromIndex; i < toIndex; i++) {
            subList.add(this.getAt(i));
        }
        return subList;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('List', List);
