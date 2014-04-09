//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisLPushQuery')

//@Require('Class')
//@Require('List')
//@Require('redis.DummyRedisQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var List                = bugpack.require('List');
var DummyRedisQuery     = bugpack.require('redis.DummyRedisQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {DummyRedisQuery}
 */
var DummyRedisLPushQuery = Class.extend(DummyRedisQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyRedisClient} dummyRedisClient
     * @param {string} key
     * @param {*} value
     */
    _constructor: function(dummyRedisClient, key, value) {

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
        this.value      = value;
    },


    //-------------------------------------------------------------------------------
    // DummyRedisQuery Methods
    //-------------------------------------------------------------------------------

    query: function() {
        var dummyRedisClient  = this.getDummyRedisClient();
        if (!dummyRedisClient.isSubscribedState()) {
            var dataMap = dummyRedisClient.getKeyToEntryMap();
            var returnedList = dataMap.get(this.key);
            if (!returnedList) {
                returnedList = new List();
                dataMap.put(this.key, returnedList);
            }
            if (!Class.doesExtend(returnedList, List)) {
                throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
            }
            returnedList.add(this.value.toString());
            return returnedList.getCount();
        } else {
            throw new Error("Connection in subscriber mode, only subscriber commands may be used");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.DummyRedisLPushQuery', DummyRedisLPushQuery);
