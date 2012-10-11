//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HashTable')

//@Require('Class')
//@Require('HashTableNode')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HashTable = Class.extend(Obj, {

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
         * @type {Object}
         */
        this.hashTableNodeObject = {};
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
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {
        var keyHashCode = Obj.hashCode(key);
        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        if (hashTableNode) {
            return hashTableNode.containsKey(key);
        }
        return false;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {

        // NOTE BRN: The for in operator will only enumerate over our own properties, not the object's built in
        // properties. So it should be safe to access this.valueObject[key]

        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            if (hashTableNode.containsValue(value)) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {function(*)} func
     */
    forEach: function(func) {
        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            hashTableNode.getValues().forEach(function(value) {
                func(value);
            });
        }
    },

    /**
     * @param {*} key
     * @return {*}
     */
    get: function(key) {
        var keyHashCode = Obj.hashCode(key);
        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        if (hashTableNode) {
            return hashTableNode.get(key);
        }
        return undefined;
    },

    /**
     * @return {Array<*>}
     */
    getKeys: function() {
        var keysArray = [];
        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            keysArray.concat(hashTableNode.getKeys());
        }
        return keysArray;
    },

    /**
     * @return {Array<*>}
     */
    getValues: function() {
        var valuesArray = [];
        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            valuesArray.concat(hashTableNode.getValues());
        }
        return valuesArray;
    },

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return (this.count === 0);
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*} Returns undefined if no value already existed at this key
     */
    put: function(key, value) {
        var keyHashCode = Obj.hashCode(key);
        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        if (!hashTableNode) {
            hashTableNode = new HashTableNode();
            this.hashTableNodeObject[keyHashCode] = hashTableNode;
        }
        var returnValue = hashTableNode.put(key, value);
        if (returnValue === undefined) {
            this.count++;
        }
        return returnValue;
    },

    /**
     * @param {*} key
     * @return {*} Returns undefined if no value already existed at this key
     */
    remove: function(key) {
        var keyHashCode = Obj.hashCode(key);
        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        var returnValue = undefined;
        if (hashTableNode) {
            returnValue = hashTableNode.remove(key);
            if (returnValue !== undefined) {
                this.count--;
                if (hashTableNode.getCount() === 0) {
                    delete this.hashTableNodeObject[keyHashCode];
                }
            }
        }
        return returnValue;
    }
});
