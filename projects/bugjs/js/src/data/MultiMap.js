/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MultiMap')

//@Require('Class')
//@Require('Collection')
//@Require('Map')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Collection  = bugpack.require('Collection');
var Map         = bugpack.require('Map');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MultiMap = Class.extend(Map, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getKeyCount: function() {
        return this.getCount();
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {MultiMap}
     */
    clone: function() {
        var cloneMultiMap = new MultiMap();
        cloneMultiMap.putAll(this);
        return cloneMultiMap;
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {
        var valueArray = this.hashTable.getValueArray();
        for (var i = 0, size = valueArray.length; i < size; i++) {
            var valueCollection = valueArray[i];
            if (valueCollection.contains(value)) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {function(*)} func
     */
    forEachCollection: function(func) {
        this.hashTable.forEach(func);
    },

    /**
     * @param {function(*)} func
     */
    forEachValue: function(func) {
        this.hashTable.forEach(function(valueCollection) {
            valueCollection.forEach(func);
        });
    },

    /**
     * @param {*} key
     * @return {(Set.<*>|undefined)}
     */
    get: function(key) {
        return this.hashTable.get(key);
    },

    /**
     * @return {Array<*>}
     */
    getKeyArray: function() {
        return this.hashTable.getKeyArray();
    },

    /**
     * @return {Collection}
     */
    getKeyCollection: function() {
        var keyCollection = new Collection();
        this.hashTable.getKeyArray().forEach(function(key) {
            keyCollection.add(key);
        });
        return keyCollection;
    },

    /**
     * @return {Array<*>}
     */
    getValueArray: function() {
        var valueArray = [];
        this.hashTable.forEach(function(valueSet) {
            valueArray = valueArray.concat(valueSet.getValueArray());
        });
        return valueArray;
    },

    /**
     * @return {Collection}
     */
    getValueCollection: function() {
        var valueCollection = new Collection();
        this.hashTable.forEach(function(valueSet) {
            valueCollection.addAll(valueSet);
        });
        return valueCollection;
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    put: function(key, value) {
        var valueCollection = this.hashTable.get(key);
        if (!valueCollection) {
            valueCollection = new Collection();
            this.hashTable.put(key, valueCollection);
        }
        valueCollection.add(value);
        return value;
    },

    /**
     * @param {(Map|MultiMap)} map
     */
    putAll: function(map) {
        if (Class.doesExtend(map, Map)) {
            var keys = map.getKeyArray();
            keys.forEach(function(key) {
                var value = map.get(key);
                this.put(key, value);
            });
        } else if (Class.doesExtend(map, MultiMap)) {
            var keys = map.getKeyArray();
            keys.forEach(function(key) {
                var valueCollection = map.get(key);
                valueCollection.forEach(function(value) {
                    this.put(key, value);
                });
            });
        }
    },

    /**
     * Removes all values under the key
     * @param {*} key
     * @return {*}
     */
    remove: function(key) {
        return this.hashTable.remove(key);
    },

    /**
     * Removes a specific value associated with the key
     * @param {*} key
     * @param {*} value
     * @return {boolean}
     */
    removeKeyValuePair: function(key, value) {
        var result = false;
        var valueCollection = this.hashTable.get(key);
        if (valueCollection) {
            result = valueCollection.remove(value);
            if (result && valueCollection.isEmpty()) {
                this.hashTable.remove(valueCollection);
            }
        }
        return result;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('MultiMap', MultiMap);
