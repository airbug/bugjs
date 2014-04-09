//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisExistsQuery')

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
var DummyRedisExistsQuery = Class.extend(DummyRedisQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyRedisClient} dummyRedisClient
     * @param {string} key
     */
    _constructor: function(dummyRedisClient, key) {

        this._super(dummyRedisClient);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.key        = key;
    },


    //-------------------------------------------------------------------------------
    // DummyRedisQuery Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    query: function() {
        var dummyRedisClient  = this.getDummyRedisClient();
        if (!dummyRedisClient.isSubscribedState()) {
            var dataMap = dummyRedisClient.getKeyToEntryMap();
            if (dataMap.containsKey(this.key)) {
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

bugpack.export('redis.DummyRedisExistsQuery', DummyRedisExistsQuery);
