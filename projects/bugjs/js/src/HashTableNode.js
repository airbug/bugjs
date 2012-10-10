//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@export('HashTableNode')

//@require('Class')
//@require('HashTableEntry')
//@require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HashTableNode = Class.extend(Obj, {

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
         * @type {number}
         */
        this.count = 0;

        /**
         * @private
         * @type {Array<HashTableEntry>}
         */
        this.hashTableEntryArray = [];
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


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toString: function() {
        var output = "{";
        output += "  count:" + this.getCount() + ",\n";
        output += "  hashTableEntryArray:[\n";
        this.hashTableEntryArray.forEach(function(value) {
            output += value.toString() + ",";
        });
        output += "  ]";
        output += "}";
        return output;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {
        for (var i = 0, size = this.hashTableEntryArray.length; i < size; i++) {
            var hashTableEntry = this.hashTableEntryArray[i];
            if (Obj.equals(key, hashTableEntry.getKey())) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {
        for (var i = 0, size = this.hashTableEntryArray.length; i < size; i++) {
            var hashTableEntry = this.hashTableEntryArray[i];
            if (Obj.equals(value, hashTableEntry.getValue())) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {*} key
     * @return {*}
     */
    get: function(key) {
        for (var i = 0, size = this.hashTableEntryArray.length; i < size; i++) {
            var hashTableEntry = this.hashTableEntryArray[i];
            if (Obj.equals(key, hashTableEntry.getKey())) {
                return hashTableEntry.getValue();
            }
        }
        return undefined;
    },

    /**
     * @return {Array<*>}
     */
    getKeys: function() {
        var keyArray = [];
        for (var i = 0, size = this.hashTableEntryArray.length; i < size; i++) {
            var hashTableEntry = this.hashTableEntryArray[i];
            keyArray.push(hashTableEntry.getKey());
        }
        return keyArray;
    },

    /**
     * @return {Array<*>}
     */
    getValues: function() {
        var valueArray = [];
        for (var i = 0, size = this.hashTableEntryArray.length; i < size; i++) {
            var hashTableEntry = this.hashTableEntryArray[i];
            valueArray.push(hashTableEntry.getValue());
        }
        return valueArray;
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    put: function(key, value) {
        for (var i = 0, size = this.hashTableEntryArray.length; i < size; i++) {
            var hashTableEntry = this.hashTableEntryArray[i];
            if (Obj.equals(key, hashTableEntry.getKey())) {
                var previousValue = hashTableEntry.getValue();
                hashTableEntry.setValue(value);
                return previousValue;
            }
        }

        //NOTE BRN: If we make it to here it means we did not find a hash table entry that already exists for this key.

        var newHashTableEntry = new HashTableEntry(key, value);
        this.hashTableEntryArray.push(newHashTableEntry);
        this.count++;
        return undefined;
    },

    /**
     * @param {*} key
     * @return {*}
     */
    remove: function(key) {
        for (var i = 0, size = this.hashTableEntryArray.length; i < size; i++) {
            var hashTableEntry = this.hashTableEntryArray[i];
            if (Obj.equals(key, hashTableEntry.getKey())) {
                this.hashTableEntryArray.splice(i, 1);
                this.count--;
                return hashTableEntry.getValue();
            }
        }
        return undefined;
    }
});
