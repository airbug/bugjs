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

//@Export('redis.DummyRedisQueryFactory')

//@Require('Class')
//@Require('Obj')
//@Require('redis.DummyRedisExistsQuery')
//@Require('redis.DummyRedisGetQuery')
//@Require('redis.DummyRedisHDelQuery')
//@Require('redis.DummyRedisHGetQuery')
//@Require('redis.DummyRedisHSetQuery')
//@Require('redis.DummyRedisLPushQuery')
//@Require('redis.DummyRedisMultiQuery')
//@Require('redis.DummyRedisPublishQuery')
//@Require('redis.DummyRedisSAddQuery')
//@Require('redis.DummyRedisSMembersQuery')
//@Require('redis.DummyRedisSRemQuery')
//@Require('redis.DummyRedisSetQuery')
//@Require('redis.DummyRedisSubscribeQuery')
//@Require('redis.DummyRedisUnsubscribeQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var DummyRedisExistsQuery       = bugpack.require('redis.DummyRedisExistsQuery');
    var DummyRedisGetQuery          = bugpack.require('redis.DummyRedisGetQuery');
    var DummyRedisHDelQuery         = bugpack.require('redis.DummyRedisHDelQuery');
    var DummyRedisHGetQuery         = bugpack.require('redis.DummyRedisHGetQuery');
    var DummyRedisHSetQuery         = bugpack.require('redis.DummyRedisHSetQuery');
    var DummyRedisLPushQuery        = bugpack.require('redis.DummyRedisLPushQuery');
    var DummyRedisMultiQuery        = bugpack.require('redis.DummyRedisMultiQuery');
    var DummyRedisPublishQuery      = bugpack.require('redis.DummyRedisPublishQuery');
    var DummyRedisSAddQuery         = bugpack.require('redis.DummyRedisSAddQuery');
    var DummyRedisSMembersQuery     = bugpack.require('redis.DummyRedisSMembersQuery');
    var DummyRedisSRemQuery         = bugpack.require('redis.DummyRedisSRemQuery');
    var DummyRedisSetQuery          = bugpack.require('redis.DummyRedisSetQuery');
    var DummyRedisSubscribeQuery    = bugpack.require('redis.DummyRedisSubscribeQuery');
    var DummyRedisUnsubscribeQuery  = bugpack.require('redis.DummyRedisUnsubscribeQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DummyRedisQueryFactory = Class.extend(Obj, {

        _name: "redis.DummyRedisQueryFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyRedisClient} dummyRedisClient
         */
        _constructor: function(dummyRedisClient) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DummyRedisClient}
             */
            this.dummyRedisClient     = dummyRedisClient;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {DummyRedisClient}
         */
        getDummyRedisClient: function() {
            return this.dummyRedisClient;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        brpoplpush: function() {

        },

        del: function() {

        },

        /**
         * @param {string} key
         * @return {DummyRedisExistsQuery}
         */
        exists: function(key) {
            return new DummyRedisExistsQuery(this.dummyRedisClient, key);
        },

        /**
         * @param {string} key
         * @return {DummyRedisGetQuery}
         */
        get: function(key) {
            return new DummyRedisGetQuery(this.dummyRedisClient, key);
        },

        getrange: function() {

        },

        /**
         * @param {string} key
         * @param {string} field
         * @return {DummyRedisHDelQuery}
         */
        hdel: function(key, field) {
            return new DummyRedisHDelQuery(this.dummyRedisClient, key, field);
        },

        hexists: function() {

        },

        /**
         * @param {string} key
         * @param {string} field
         * @return {DummyRedisHGetQuery}
         */
        hget: function(key, field) {
            return new DummyRedisHGetQuery(this.dummyRedisClient, key, field);
        },

        hlen: function() {

        },

        /**
         * @param {string} key
         * @param {string} field
         * @param {*} value
         * @return {DummyRedisHSetQuery}
         */
        hset: function(key, field, value) {
            return new DummyRedisHSetQuery(this.dummyRedisClient, key, field, value);
        },

        hvals: function() {

        },

        /**
         * @param {string} key
         * @param {*} value
         * @return {DummyRedisLPushQuery}
         */
        lpush: function(key, value) {
            return new DummyRedisLPushQuery(this.dummyRedisClient, key, value);
        },

        lrem: function() {

        },

        /**
         * @return {DummyRedisMultiQuery}
         */
        multi: function() {
            return new DummyRedisMultiQuery(this.dummyRedisClient);
        },

        /**
         * @param {string} channel
         * @param {*} message
         * @return {DummyRedisPublishQuery}
         */
        publish: function(channel, message) {
            return new DummyRedisPublishQuery(this.dummyRedisClient, channel, message);
        },

        rpoplpush: function() {

        },

        /**
         * @param {string} key
         * @param {*} member
         * @return {DummyRedisSAddQuery}
         */
        sadd: function(key, member) {
            return new DummyRedisSAddQuery(this.dummyRedisClient, key, member);
        },

        scard: function() {

        },

        /**
         * @param {string} key
         * @param {*} value
         * @return {DummyRedisSetQuery}
         */
        set: function(key, value) {
            return new DummyRedisSetQuery(this.dummyRedisClient, key, value);
        },

        setnx: function() {

        },

        /**
         * @param {string} key
         * @return {DummyRedisSMembersQuery}
         */
        smembers: function(key) {
            return new DummyRedisSMembersQuery(this.dummyRedisClient, key);
        },

        /**
         * @param {string} key
         * @param {*} member
         * @return {DummyRedisSRemQuery}
         */
        srem: function(key, member) {
            return new DummyRedisSRemQuery(this.dummyRedisClient, key, member);
        },

        /**
         * @param {string} channel
         * @return {DummyRedisSubscribeQuery}
         */
        subscribe: function(channel) {
            return new DummyRedisSubscribeQuery(this.dummyRedisClient, channel);
        },

        /**
         * @param {string} channel
         * @return {DummyRedisUnsubscribeQuery}
         */
        unsubscribe: function(channel) {
            return new DummyRedisUnsubscribeQuery(this.dummyRedisClient, channel);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('redis.DummyRedisQueryFactory', DummyRedisQueryFactory);
});
