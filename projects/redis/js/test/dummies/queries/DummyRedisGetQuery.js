//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisGetQuery')

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
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
var TypeUtil            = bugpack.require('TypeUtil');
var DummyRedisQuery     = bugpack.require('redis.DummyRedisQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {DummyRedisQuery}
 */
var DummyRedisGetQuery = Class.extend(DummyRedisQuery, {

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
                var value       = dataMap.get(this.key);
                if (TypeUtil.isString(value)) {
                    return value;
                } else {
                    throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
                }
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

bugpack.export('redis.DummyRedisGetQuery', DummyRedisGetQuery);
