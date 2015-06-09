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

//@Export('redis.DummyRedisMultiQuery')

//@Require('Class')
//@Require('Flows')
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
    var Flows               = bugpack.require('Flows');
    var List                = bugpack.require('List');
    var DummyRedisQuery     = bugpack.require('redis.DummyRedisQuery');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $iterableSeries     = Flows.$iterableSeries;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DummyRedisQuery}
     */
    var DummyRedisMultiQuery = Class.extend(DummyRedisQuery, {

        _name: "redis.DummyRedisMultiQuery",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyRedisClient} dummyRedisClient
         */
        _constructor: function(dummyRedisClient) {

            this._super(dummyRedisClient);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DummyRedisQueryFactory}
             */
            this.queryFactory   = dummyRedisClient.getQueryFactory();

            /**
             * @private
             * @type {List.<DummyRedisQuery>}
             */
            this.queryList      = new List();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------
        // DummyRedisQuery Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Error, *=)} callback
         */
        exec: function(callback) {
            var results     = [];
            var errors      = null;
            $iterableSeries(this.queryList, function(flow, query) {
                query.exec(function(error, result) {
                    if (!error) {
                        results.push(result);
                    } else {
                        if (!errors) {
                            errors = [];
                        }
                        errors.push(error);
                    }
                    flow.complete();
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(errors, results);
                } else {
                    callback(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        brpoplpush: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        del: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @return {DummyRedisMultiQuery}
         */
        exists: function(key) {
            var query = this.queryFactory.exists(key);
            this.queryList.add(query);
            return this;
        },

        /**
         * @param {string} key
         * @return {DummyRedisMultiQuery}
         */
        get: function(key) {
            var query = this.queryFactory.get(key);
            this.queryList.add(query);
            return this;
        },

        getrange: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @param {string} field
         * @return {DummyRedisMultiQuery}
         */
        hdel: function(key, field) {
            var query = this.queryFactory.hdel(key, field);
            this.queryList.add(query);
            return this;
        },

        hexists: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @param {string} field
         * @return {DummyRedisMultiQuery}
         */
        hget: function() {
            var query = this.queryFactory.hget(key, field);
            this.queryList.add(query);
            return this;
        },

        hlen: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @param {string} field
         * @param {*} value
         * @return {DummyRedisMultiQuery}
         */
        hset: function(key, field, value) {
            var query = this.queryFactory.hset(key, field, value);
            this.queryList.add(query);
            return this;
        },

        hvals: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @param {*} value
         * @return {DummyRedisMultiQuery}
         */
        lpush: function(key, value) {
            var query = this.queryFactory.lpush(key, value);
            this.queryList.add(query);
            return this;
        },

        lrem: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} channel
         * @param {*} message
         * @return {DummyRedisMultiQuery}
         */
        publish: function(channel, message) {
            var query = this.queryFactory.sadd(channel, message);
            this.queryList.add(query);
            return this;
        },

        rpoplpush: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @param {*} members
         * @return {DummyRedisMultiQuery}
         */
        sadd: function(key, members) {
            var query = this.queryFactory.sadd(key, members);
            this.queryList.add(query);
            return this;
        },

        scard: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @param {*} value
         * @return {DummyRedisMultiQuery}
         */
        set: function(key, value) {
            var query = this.queryFactory.set(key, value);
            this.queryList.add(query);
            return this;
        },

        setnx: function() {
            throw new Error("DummyRedisMultiQuery Not Implemented");
        },

        /**
         * @param {string} key
         * @return {DummyRedisMultiQuery}
         */
        smembers: function(key) {
            var query = this.queryFactory.smembers(key);
            this.queryList.add(query);
            return this;
        },

        /**
         * @param {string} key
         * @param {*} member
         * @return {DummyRedisMultiQuery}
         */
        srem: function(key, member) {
            var query = this.queryFactory.srem(key, member);
            this.queryList.add(query);
            return this;
        },

        /**
         * @param {string} channel
         * @return {DummyRedisMultiQuery}
         */
        subscribe: function(channel) {
            var query = this.queryFactory.subscribe(channel);
            this.queryList.add(query);
            return this;
        },

        /**
         * @param {string} channel
         * @return {DummyRedisMultiQuery}
         */
        unsubscribe: function(channel) {
            var query = this.queryFactory.unsubscribe(channel);
            this.queryList.add(query);
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('redis.DummyRedisMultiQuery', DummyRedisMultiQuery);
});
