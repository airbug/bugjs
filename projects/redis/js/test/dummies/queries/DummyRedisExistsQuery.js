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

//@Export('redis.DummyRedisExistsQuery')

//@Require('Class')
//@Require('Set')
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
    var DummyRedisQuery     = bugpack.require('redis.DummyRedisQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DummyRedisQuery}
     */
    var DummyRedisExistsQuery = Class.extend(DummyRedisQuery, {

        _name: "redis.DummyRedisExistsQuery",


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
});
