//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('redis')

//@Export('RedisSubscriber')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('redis.RedisEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Exception                   = bugpack.require('Exception');
var Obj                         = bugpack.require('Obj');
var RedisEvent                  = bugpack.require('redis.RedisEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var RedisSubscriber = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {RedisClient} redisClient
     * @param {string} channel
     */
    _constructor: function(redisClient, channel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.channel        = channel;

        /**
         * @private
         * @type {RedisClient}
         */
        this.redisClient    = redisClient;

        /**
         * @private
         * @type {RedisSubscriber.States}
         */
        this.state          = RedisSubscriber.States.UNSUBSCRIBED;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getChannel: function() {
        return this.channel;
    },

    /**
     * @return {RedisClient}
     */
    getRedisClient: function() {
        return this.redisClient;
    },

    /**
     * @return {RedisSubscriber.States}
     */
    getState: function() {
        return this.state;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isSubscribed: function() {
        return this.state ===  RedisSubscriber.States.SUBSCRIBED;
    },

    /**
     * @return {boolean}
     */
    isSubscribing: function() {
        return this.state ===  RedisSubscriber.States.SUBSCRIBING;
    },

    /**
     * @return {boolean}
     */
    isUnsubscribed: function() {
        return this.state ===  RedisSubscriber.States.UNSUBSCRIBED;
    },

    /**
     * @return {boolean}
     */
    isUnsubscribing: function() {
        return this.state ===  RedisSubscriber.States.SUBSCRIBING;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    subscribe: function(callback) {
        if (this.isUnsubscribed()) {
            this.doSubscribe(callback);
        } else if (this.isUnsubscribing()) {
            this.delaySubscribe(callback);
        } else {
            callback();
        }
    },

    /**
     * @param {function(Throwable=)} callback
     */
    unsubscribe: function(callback) {
        if (this.isSubscribed()) {
            this.doUnsubscribe(callback);
        } else if (this.isSubscribing()) {
            this.delayUnsubscribe(callback);
        } else {
            callback();
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    delaySubscribe: function(callback) {
        var _this = this;
        var hearRedisUnsubscribeEvent = function(event) {
            var channel = event.getData().channel;
            if (channel === _this.getChannel()) {
                _this.redisClient.removeEventListener(RedisEvent.EventTypes.UNSUBSCRIBE, hearRedisUnsubscribeEvent);
                _this.doSubscribe(callback);
            }
        };
        this.redisClient.addEventListener(RedisEvent.EventTypes.UNSUBSCRIBE, hearRedisUnsubscribeEvent);
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    delayUnsubscribe: function(callback) {
        var _this = this;
        var hearRedisSubscribeEvent = function(event) {
            var channel = event.getData().channel;
            if (channel === _this.getChannel()) {
                _this.redisClient.removeEventListener(RedisEvent.EventTypes.SUBSCRIBE, hearRedisSubscribeEvent);
                _this.doSubscribe(callback);
            }
        };
        this.redisClient.addEventListener(RedisEvent.EventTypes.SUBSCRIBE, hearRedisSubscribeEvent);
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    doSubscribe: function(callback) {
        var _this = this;
        this.state = RedisSubscriber.States.SUBSCRIBING;
        this.redisClient.subscribe(this.channel, function(error, reply) {
            if (!error) {
                var hearRedisSubscribeEvent = function(event) {
                    var channel = event.getData().channel;
                    if (channel === _this.getChannel()) {
                        _this.state = RedisSubscriber.States.SUBSCRIBED;
                        _this.redisClient.removeEventListener(RedisEvent.EventTypes.SUBSCRIBE, hearRedisSubscribeEvent);
                        callback();
                    }
                };
                _this.redisClient.addEventListener(RedisEvent.EventTypes.SUBSCRIBE, hearRedisSubscribeEvent);
            } else {
                callback(new Exception("RedisError", {}, "An error occurred in redis", [error]));
            }
        });
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    doUnsubscribe: function(callback) {
        var _this = this;
        this.state = RedisSubscriber.States.UNSUBSCRIBING;
        this.redisClient.unsubscribe(this.channel, function(error, reply) {
            if (!error) {
                var hearRedisUnsubscribeEvent = function(event) {
                    var channel = event.getData().channel;
                    if (channel === _this.getChannel()) {
                        _this.state = RedisSubscriber.States.UNSUBSCRIBED;
                        _this.redisClient.removeEventListener(RedisEvent.EventTypes.UNSUBSCRIBE, hearRedisUnsubscribeEvent);
                        callback();
                    }
                };
                _this.redisClient.addEventListener(RedisEvent.EventTypes.UNSUBSCRIBE, hearRedisUnsubscribeEvent);
            } else {
                callback(new Exception("RedisError", {}, "An error occurred in redis", [error]));
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
RedisSubscriber.States = {
    SUBSCRIBED: "State:Subscribed",
    SUBSCRIBING: "State:Subscribing",
    UNSUBSCRIBING: "State:Unsubscribing",
    UNSUBSCRIBED: "State:Unsubscribed"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.RedisSubscriber', RedisSubscriber);
