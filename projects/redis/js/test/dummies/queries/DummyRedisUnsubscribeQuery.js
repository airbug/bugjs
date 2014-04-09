//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisUnsubscribeQuery')

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
var DummyRedisUnsubscribeQuery = Class.extend(DummyRedisQuery, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyRedisClient} dummyRedisClient
     * @param {string} channel
     */
    _constructor: function(dummyRedisClient, channel) {

        this._super(dummyRedisClient);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.channel    = channel;
    },


    //-------------------------------------------------------------------------------
    // DummyRedisQuery Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     * @return {*}
     */
    query: function() {
        var dummyRedisClient  = this.getDummyRedisClient();
        dummyRedisClient.unsubscribeFromChannel(this.channel);
        return this.channel;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.DummyRedisUnsubscribeQuery', DummyRedisUnsubscribeQuery);
