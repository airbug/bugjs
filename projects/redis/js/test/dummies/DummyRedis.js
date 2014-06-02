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

//@Export('redis.DummyRedis')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('redis.DummyRedisClient')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var List                = bugpack.require('List');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var DummyRedisClient    = bugpack.require('redis.DummyRedisClient');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DummyRedis = Class.extend(Obj, {

        _name: "redis.DummyRedis",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, List.<DummyRedisClient>>}
             */
            this.channelToClientListMap     = new Map();

            /**
             * @private
             * @type {Map.<string, *>}
             */
            this.keyToEntryMap              = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Map.<string, List.<DummyRedisClient>>}
         */
        getChannelToClientListMap: function() {
            return this.channelToClientListMap;
        },

        /**
         * @return {Map.<string, *>}
         */
        getKeyToEntryMap: function() {
            return this.keyToEntryMap;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} channel
         * @param {string} message
         * @return {number}
         */
        publishToChannel: function(channel, message) {
            var clientList  = this.channelToClientListMap.get(channel);
            if (clientList) {
                var cloneClientList = clientList.clone();
                setTimeout(function() {
                    cloneClientList.forEach(function(client) {
                        client.receiveMessage(message, channel);
                    });
                }, 0);
                return cloneClientList.getCount();
            }
            return 0;
        },

        /**
         * @param {string} channel
         * @param {DummyRedisClient} dummyRedisClient
         */
        subscribeToChannel: function(channel, dummyRedisClient) {
            var clientList = this.channelToClientListMap.get(channel);
            if (!clientList) {
                clientList = new List();
                this.channelToClientListMap.put(channel, clientList);
            }
            if (!clientList.contains(dummyRedisClient)) {
                clientList.add(dummyRedisClient);
            }
        },

        /**
         * @param {string} channel
         * @param {DummyRedisClient} dummyRedisClient
         */
        unsubscribeFromChannel: function(channel, dummyRedisClient) {
            var clientList = this.channelToClientListMap.get(channel);
            if (clientList) {
                clientList.remove(dummyRedisClient);
                if (clientList.isEmpty()) {
                    this.channelToClientListMap.remove(channel);
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Redis Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {number} port
         * @param {string} host
         * @return {DummyRedisClient}
         */
        createClient: function(port, host) {
            var client = new DummyRedisClient(this);
            setTimeout(function() {
                client.makeReady();
            }, 0);
            return client;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('redis.DummyRedis', DummyRedis);
});
