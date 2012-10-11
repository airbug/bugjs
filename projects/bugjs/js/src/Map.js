/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 */

//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Map')

//@Require('Class')
//@Require('HashTable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Map = Class.extend(Obj, {

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
         * @type {HashTable}
         */
        this.hashTable = new HashTable();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCount: function() {
        return this.hashTable.getCount();
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    clone: function() {
        var cloneMap = new Map();
        cloneMap.putAll(this);
        return cloneMap;
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clear: function() {
        this.hashTable = new HashTable();
    },

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {
        return this.hashTable.containsKey(key);
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {
        return this.hashTable.containsValue(value);
    },

    /**
     * @param {function(*)} func
     */
    forEach: function(func) {
        this.hashTable.forEach(func);
    },

    /**
     * @param {*} key
     * @return {*} Returns undefined if no value is found.
     */
    get: function(key) {
        return this.hashTable.get(key);
    },

    /**
     * @return {Array<*>}
     */
    getKeys: function() {
        return this.hashTable.getKeys();
    },

    /**
     * @return {Array<*>}
     */
    getValues: function() {
        return this.hashTable.getValues();
    },

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return this.hashTable.isEmpty();
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    put: function(key, value) {
        return this.hashTable.put(key, value);
    },

    /**
     * @param {Map} map
     */
    putAll: function(map) {
        if (Class.doesExtend(map, Map)) {
            var keys = map.getKeys();
            keys.forEach(function(key) {
                var value = map.get(key);
                this.put(key, value);
            });
        }
    },

    /**
     * @param {*} key
     * @return {*}
     */
    remove: function(key) {
        return this.hashTable.remove(key);
    }
});
