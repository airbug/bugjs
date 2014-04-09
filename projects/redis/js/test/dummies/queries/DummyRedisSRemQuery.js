//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisSRemQuery')

//@Require('Class')
//@Require('Set')
//@Require('redis.DummyRedisQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Set                 = bugpack.require('Set');
var DummyRedisQuery     = bugpack.require('redis.DummyRedisQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {DummyRedisQuery}
 */
var DummyRedisSRemQuery = Class.extend(DummyRedisQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyRedisClient} dummyRedisClient
     * @param {string} key
     * @param {*} setValue
     */
    _constructor: function(dummyRedisClient, key, setValue) {

        this._super(dummyRedisClient);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.key        = key;

        /**
         * @private
         * @type {*}
         */
        this.setValue   = setValue;
    },


    //-------------------------------------------------------------------------------
    // DummyRedisQuery Methods
    //-------------------------------------------------------------------------------

    query: function() {
        var dummyRedisClient  = this.getDummyRedisClient();
        if (!dummyRedisClient.isSubscribedState()) {
            var dataMap     = dummyRedisClient.getKeyToEntryMap();
            var returnedSet = dataMap.get(this.key);
            if (!returnedSet) {
                returnedSet = new Set();
            }
            if (!Class.doesExtend(returnedSet, Set)) {
                throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            }
            var result = returnedSet.remove(this.setValue.toString());
            if (result) {
                return 1;
            } else {
                return 0;
            }
        } else {
            throw new Error("Connection in subscriber mode, only subscriber commands may be used");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.DummyRedisSRemQuery', DummyRedisSRemQuery);
