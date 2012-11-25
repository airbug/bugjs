//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('List')

//@Require('Class')
//@Require('Collection')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var List = Class.extend(Collection, {

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
         * @type {Array.<*>}
         */
        this.valueArray = [];
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Array} Array is in the same order as the list
     */
    getValueArray: function() {
        var valueArray = [];
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            valueArray.push(this.valueArray[i]);
        }
        return valueArray;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {List}
     */
    clone: function() {
        var cloneList = new List();
        cloneList.addAll(this);
        return cloneList;
    },

    /**
     * Two lists are equal if they have the same elements in the same order.
     *
     */
    equals: function() {

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
     * @override
     * @param {function(*)} func
     */
    forEach: function(func) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            func(this.valueArray[i]);
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
            this.count++;
            this.valueArray.splice(index, 0, value);
        } else {
            throw new Error("Index out of bounds");
        }
    },

    /**
     * @param {number} index
     * @param {Collection} collection
     */
    addAllAt: function(index, collection) {
        if (Class.doesExtend(collection, Collection)) {
            var insertingIndex = index;
            var _this = this;
            collection.forEach(function(value) {
                _this.addAt(insertingIndex, value);

                // NOTE BRN: We increment the inserting index so that the collection is inserted in the correct order.

                insertingIndex++;
            });
        } else {
            throw new Error("collection must be an instance of Collection");
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
            this.count--;
            this.valueArray.splice(index, 1);
        }
        return value;
    },

    /**
     * @param index
     * @param value
     */
    set: function(index, value) {
        this.removeAt(index);
        this.addAt(index, value);
    }
});
