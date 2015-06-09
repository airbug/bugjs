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

//@Export('redis.RedisPubSub')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('redis.RedisEvent')
//@Require('redis.RedisMessage')
//@Require('redis.RedisSubscriber')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var Map                 = bugpack.require('Map');
    var RedisEvent          = bugpack.require('redis.RedisEvent');
    var RedisMessage        = bugpack.require('redis.RedisMessage');
    var RedisSubscriber     = bugpack.require('redis.RedisSubscriber');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var RedisPubSub = Class.extend(EventDispatcher, {

        _name: "redis.RedisPubSub",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RedisClient} redisClient
         * @param {RedisClient} subscriberRedisClient
         */
        _constructor: function(redisClient, subscriberRedisClient) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, RedisSubscriber>}
             */
            this.channelToRedisSubscriberMap        = new Map();

            /**
             * @private
             * @type {RedisClient}
             */
            this.redisClient                        = redisClient;

            /**
             * @private
             * @type {RedisClient}
             */
            this.subscriberRedisClient              = subscriberRedisClient;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {RedisClient}
         */
        getRedisClient: function() {
            return this.redisClient;
        },

        /**
         * @return {RedisClient}
         */
        getSubscriberRedisClient: function() {
            return this.subscriberRedisClient;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitialize: function(callback) {
            this.subscriberRedisClient.off(RedisEvent.EventTypes.MESSAGE, this.hearRedisMessageEvent, this);
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initialize: function(callback) {
            this.subscriberRedisClient.on(RedisEvent.EventTypes.MESSAGE, this.hearRedisMessageEvent, this);
            callback();
        },

        /**
         * @param {string} channel
         * @param {string} message
         * @param {function(Throwable, number=)} callback
         */
        publish: function(channel, message, callback) {
            this.redisClient.publish(channel, message, callback);
        },

        /**
         * @param {string} channel
         * @param {function(Throwable=)} callback
         */
        subscribe: function(channel, callback) {
            if (!this.hasSubscriberForChannel(channel)) {
                var redisSubscriber = this.factoryRedisSubscriber(channel);
                this.channelToRedisSubscriberMap.put(channel, redisSubscriber);
                redisSubscriber.subscribe(callback);
            } else {
                callback();
            }
        },

        /**
         * @param {string} channel
         * @param {function(Throwable=)} callback
         */
        unsubscribe: function(channel, callback) {
            if (this.hasSubscriberForChannel(channel)) {
                var redisSubscriber = this.channelToRedisSubscriberMap.remove(channel);
                redisSubscriber.unsubscribe(callback);
            } else {
                callback();
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} message
         * @return {RedisMessage}
         */
        factoryRedisMessage: function(message) {
            return new RedisMessage(message);
        },

        /**
         * @private
         * @param {string} channel
         * @return {RedisSubscriber}
         */
        factoryRedisSubscriber: function(channel) {
            return new RedisSubscriber(this.subscriberRedisClient, channel);
        },

        /**
         * @private
         * @param {string} channel
         * @return {boolean}
         */
        hasSubscriberForChannel: function(channel) {
            return this.channelToRedisSubscriberMap.containsKey(channel);
        },

        /**
         * @private
         * @param {RedisMessage} redisMessage
         * @param {string} redisChannel
         */
        processMessage: function(redisMessage, redisChannel) {
            this.dispatchEvent(new Event(RedisPubSub.EventTypes.MESSAGE, {
                redisMessage: redisMessage,
                redisChannel: redisChannel
            }));
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {RedisEvent} event
         */
        hearRedisMessageEvent: function(event) {
            var channel     = event.getData().channel;
            var message     = event.getData().message;
            var redisMessage = this.factoryRedisMessage(message);
            this.processMessage(redisMessage, channel);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    RedisPubSub.EventTypes = {
        MESSAGE: "RedisPubSub:Message"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('redis.RedisPubSub', RedisPubSub);
});
