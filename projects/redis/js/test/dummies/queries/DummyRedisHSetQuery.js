//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisHSetQuery')

//@Require('Class')
//@Require('Map')
//@Require('redis.DummyRedisQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var DummyRedisQuery     = bugpack.require('redis.DummyRedisQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {DummyRedisQuery}
 */
var DummyRedisHSetQuery = Class.extend(DummyRedisQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyRedisClient} dummyRedisClient
     * @param {string} key
     * @param {string} field
     * @param {*} value
     */
    _constructor: function(dummyRedisClient, key, field, value) {

        this._super(dummyRedisClient);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.field      = field;

        /**
         * @private
         * @type {string}
         */
        this.key        = key;

        /**
         * @private
         * @type {*}
         */
        this.value      = value;
    },


    //-------------------------------------------------------------------------------
    // DummyRedisQuery Methods
    //-------------------------------------------------------------------------------

    query: function() {
        var dummyRedisClient  = this.getDummyRedisClient();
        if (!dummyRedisClient.isSubscribedState()) {
            var dataMap     = dummyRedisClient.getKeyToEntryMap();
            var returnedMap = dataMap.get(this.key);
            if (!returnedMap) {
                returnedMap = new Map();
                dataMap.put(this.key, returnedMap);
            }
            if (!Class.doesExtend(returnedMap, Map)) {
                throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            }
            var result = returnedMap.put(this.key.toString(), this.value.toString());
            if (result) {
                return result;
            } else {
                return null;
            }
        } else {
            throw new Error("Connection in subscriber mode, only subscriber commands may be used");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.DummyRedisHSetQuery', DummyRedisHSetQuery);
