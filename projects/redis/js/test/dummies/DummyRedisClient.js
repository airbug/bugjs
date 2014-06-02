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

//@Export('redis.DummyRedisClient')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('redis.DummyRedisQueryFactory')


//-------------------------------------------------------------------------------
// Conext
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Event                       = bugpack.require('Event');
    var EventDispatcher             = bugpack.require('EventDispatcher');
    var Map                         = bugpack.require('Map');
    var Obj                         = bugpack.require('Obj');
    var Set                         = bugpack.require('Set');
    var DummyRedisQueryFactory      = bugpack.require('redis.DummyRedisQueryFactory');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DummyRedisClient = Class.extend(Obj, {

        _name: "redis.DummyRedisClient",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyRedis} dummyRedis
         */
        _constructor: function(dummyRedis) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<string>}
             */
            this.channelSet         = new Set();

            /**
             * @private
             * @type {DummyRedis}
             */
            this.dummyRedis         = dummyRedis;

            /**
             * @private
             * @type {EventDispatcher}
             */
            this.eventDispatcher    = new EventDispatcher();

            /**
             * @private
             * @type {DummyRedisQueryFactory}
             */
            this.queryFactory       = new DummyRedisQueryFactory(this);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<string>}
         */
        getChannelSet: function() {
            return this.channelSet;
        },

        /**
         * @return {Map.<string, *>}
         */
        getKeyToEntryMap: function() {
            return this.dummyRedis.getKeyToEntryMap();
        },

        /**
         * @return {DummyRedisQueryFactory}
         */
        getQueryFactory: function() {
            return this.queryFactory;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isSubscribedState: function() {
            return !this.channelSet.isEmpty();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        makeReady: function() {
            this.eventDispatcher.dispatchEvent(new Event("ready", {}));
        },

        /**
         * @param {string} channel
         * @param {string} message
         * @return {number}
         */
        publishToChannel: function(channel, message) {
            return this.dummyRedis.publishToChannel(channel, message);
        },

        /**
         * @param {string} message
         * @param {string} channel
         */
        receiveMessage: function(message, channel) {
            this.eventDispatcher.dispatchEvent(new Event("message", {
                channel: channel,
                message: message
            }));
        },

        /**
         * @param {string} channel
         */
        subscribeToChannel: function(channel) {
            var _this = this;
            this.dummyRedis.subscribeToChannel(channel, this);
            this.channelSet.add(channel);
            setTimeout(function() {
                _this.eventDispatcher.dispatchEvent(new Event("subscribe", {
                    channel: channel,
                    count: _this.channelSet.getCount()
                }));
            }, 0);
        },

        /**
         * @param {string} channel
         */
        unsubscribeFromChannel: function(channel) {
            var _this = this;
            this.dummyRedis.unsubscribeFromChannel(channel, this);
            this.channelSet.remove(channel);
            setTimeout(function() {
                _this.eventDispatcher.dispatchEvent(new Event("unsubscribe", {
                    channel: channel,
                    count: _this.channelSet.getCount()
                }));
            }, 0);
        },


        //-------------------------------------------------------------------------------
        // Redis Methods
        //-------------------------------------------------------------------------------

        brpoplpush: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        del: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {function(Error, number=)} callback
         */
        exists: function(key, callback) {
            var query = this.queryFactory.exists(key);
            query.exec(callback);
        },

        /**
         * @param {string} key
         * @param {function(Error, string=)} callback
         */
        get: function(key, callback) {
            var query = this.queryFactory.get(key);
            query.exec(callback);
        },

        getrange: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {string} field
         * @param {function(Error, number=)} callback
         */
        hdel: function(key, field, callback) {
            var query = this.queryFactory.hdel(key, field);
            query.exec(callback);
        },

        hexists: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {string} field
         * @param {function(Error, string=)} callback
         */
        hget: function(key, field, callback) {
            var query = this.queryFactory.hget(key, field);
            query.exec(callback);
        },

        hlen: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {string} field
         * @param {*} value
         * @param {function(Error, number=)} callback
         */
        hset: function(key, field, value, callback) {
            var query = this.queryFactory.hset(key, field, value);
            query.exec(callback);
        },

        hvals: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {*} value
         * @param {function(Error, number=)} callback
         */
        lpush: function(key, value, callback) {
            var query = this.queryFactory.lpush(key, value);
            query.exec(callback);
        },

        lrem: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @return {DummyRedisMultiQuery}
         */
        multi: function() {
            return this.queryFactory.multi();
        },

        /**
         * @param {string} eventType
         * @param {function(...=)} listenerMethod
         */
        on: function(eventType, listenerMethod) {
            switch(eventType) {
                case "message":
                    this.eventDispatcher.on(eventType, function(event) {
                        listenerMethod(event.getData().channel, event.getData().message);
                    });
                    break;
                case "ready":
                    this.eventDispatcher.on(eventType, function(event) {
                        listenerMethod();
                    });
                    break;
                case "subscribe":
                case "unsubscribe":
                    this.eventDispatcher.on(eventType, function(event) {
                        listenerMethod(event.getData().channel, event.getData().count);
                    });
                    break;
            }
        },

        /**
         * @param {string} channel
         * @param {*} message
         * @param {function(Error, number=)} callback
         */
        publish: function(channel, message, callback) {
            var query = this.queryFactory.publish(channel, message);
            query.exec(callback);
        },

        rpoplpush: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {*} setValue
         * @param {function(Error, number=)} callback
         */
        sadd: function(key, setValue, callback) {
            var query = this.queryFactory.sadd(key, setValue);
            query.exec(callback);
        },

        scard: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {*} value
         * @param {function(Error, boolean=)} callback
         */
        set: function(key, value, callback) {
            var query = this.queryFactory.set(key, value);
            query.exec(callback);
        },

        setnx: function() {
            throw new Error("DummyRedisClient Not Implemented");
        },

        /**
         * @param {string} key
         * @param {function(Error, Array.<*>=)} callback
         */
        smembers: function(key, callback) {
            var query = this.queryFactory.smembers(key);
            query.exec(callback);
        },

        /**
         * @param {string} key
         * @param {*} member
         * @param {function(Error, Array.<*>=)} callback
         */
        srem: function(key, member, callback) {
            var query = this.queryFactory.srem(key, member);
            query.exec(callback);
        },

        /**
         * @param {string} channel
         * @param {function(Error, string=)} callback
         */
        subscribe: function(channel, callback) {
            var query = this.queryFactory.subscribe(channel);
            query.exec(callback);
        },

        /**
         * @param {string} channel
         * @param {function(Error, string=)} callback
         */
        unsubscribe: function(channel, callback) {
            var query = this.queryFactory.unsubscribe(channel);
            query.exec(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('redis.DummyRedisClient', DummyRedisClient);
});
