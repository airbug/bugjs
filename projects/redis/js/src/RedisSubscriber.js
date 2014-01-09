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

var RedisSubscriber = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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

    getChannel: function() {
        return this.channel;
    },

    getRedisClient: function() {
        return this.redisClient;
    },

    isSubscribed: function() {
        return this.state ===  RedisSubscriber.States.SUBSCRIBED;
    },

    isSubscribing: function() {
        return this.state ===  RedisSubscriber.States.SUBSCRIBING;
    },

    isUnsubscribed: function() {
        return this.state ===  RedisSubscriber.States.UNSUBSCRIBED;
    },

    isUnsubscribing: function() {
        return this.state ===  RedisSubscriber.States.SUBSCRIBING;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    subscribe: function(callback) {
        if (this.isUnsubscribed()) {
            this.doSubscribe(callback);
        } else if (this.isUnsubscribing()) {
            this.delaySubscribe(callback);
        } else {
            callback();
        }
    },

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
    
    doSubscribe: function(callback) {
        var _this = this;
        this.state = RedisSubscriber.States.SUBSCRIBING;
        var hearRedisSubscribeEvent = function(event) {
            var channel = event.getData().channel;
            if (channel === _this.getChannel()) {
                _this.state = RedisSubscriber.States.SUBSCRIBED;
                _this.redisClient.removeEventListener(RedisEvent.EventTypes.SUBSCRIBE, hearRedisSubscribeEvent);
                callback();
            }
        };
        this.redisClient.addEventListener(RedisEvent.EventTypes.SUBSCRIBE, hearRedisSubscribeEvent);
        this.redisClient.subscribe(this.channel);
    },
    
    doUnsubscribe: function(callback) {
        var _this = this;
        this.state = RedisSubscriber.States.UNSUBSCRIBING;
        var hearRedisUnsubscribeEvent = function(event) {
            var channel = event.getData().channel;
            if (channel === _this.getChannel()) {
                _this.state = RedisSubscriber.States.UNSUBSCRIBED;
                _this.redisClient.removeEventListener(RedisEvent.EventTypes.UNSUBSCRIBE, hearRedisUnsubscribeEvent);
                callback();
            }
        };
        this.redisClient.addEventListener(RedisEvent.EventTypes.UNSUBSCRIBE, hearRedisUnsubscribeEvent);
        this.redisClient.unsubscribe(this.channel);
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
