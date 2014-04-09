//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisHGetQuery')

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
var DummyRedisHGetQuery = Class.extend(DummyRedisQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyRedisClient} dummyRedisClient
     * @param {string} key
     * @param {string} field
     */
    _constructor: function(dummyRedisClient, key, field) {

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
            }
            if (!Class.doesExtend(returnedMap, Map)) {
                throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            }
            var result = returnedMap.get(this.key.toString());
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

bugpack.export('redis.DummyRedisHGetQuery', DummyRedisHGetQuery);
