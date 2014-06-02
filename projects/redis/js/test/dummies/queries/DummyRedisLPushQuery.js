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

//@Export('redis.DummyRedisLPushQuery')

//@Require('Class')
//@Require('List')
//@Require('redis.DummyRedisQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
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

        _name: "redis.DummyRedisLPushQuery",


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
});
