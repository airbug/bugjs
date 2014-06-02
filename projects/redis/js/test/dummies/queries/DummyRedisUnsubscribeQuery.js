/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.DummyRedisUnsubscribeQuery')

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('redis.DummyRedisQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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

        _name: "redis.DummyRedisUnsubscribeQuery",


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
});
