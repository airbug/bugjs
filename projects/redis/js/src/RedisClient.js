//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('redis')

//@Export('RedisClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('redis.RedisEvent')
//@Require('redis.RedisSubscriber')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');
var RedisEvent          = bugpack.require('redis.RedisEvent');
var RedisSubscriber     = bugpack.require('redis.RedisSubscriber');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RedisClient = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(redis, config) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        /**
         * @private
         * @type {Map}
         */
        this.channelToRedisSubscriberMap        = new Map();

        /**
         * @private
         * @type {RedisConfig}
         */
        this.config                             = config;

        /**
         * @private
         * @type {boolean}
         */
        this.connected                          = false;

        /**
         * @private
         * @type {boolean}
         */
        this.connecting                         = false;

        /**
         * @private
         * @type {*}
         */
        this.redis                              = redis;

        /**
         * @private
         * @type {*}
         */
        this.client                             = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getClient: function() {
        return this.client;
    },

    /**
     * @return {boolean}
     */
    getConnected: function() {
        return this.connected;
    },

    /**
     * @returns {boolean}
     */
    getConnecting: function() {
        return this.connecting;
    },

    /**
     * @return {*}
     */
    getRedis: function() {
        return this.redis;
    },

    /**
     * @return {boolean}
     */
    isConnected: function() {
        return this.connected;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    connect: function(callback) {
        var _this = this;
        var cbFired = false;
        if (!this.getConnected() && !this.getConnecting()) {
            this.connecting = true;
            this.client     = this.redis.createClient(this.config.getPort(), this.config.getHost());
            this.client.on("connect", function() {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.CONNECT));
            });
            this.client.on("drain", function() {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.DRAIN));
            });
            this.client.on("end", function() {
                _this.connected = false;
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.END));
            });
            this.client.on("error", function(error) {
                if (!cbFired) {
                    cbFired = true;
                    callback(error);
                }
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.ERROR));
            });
            this.client.on("idle", function() {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.IDLE));
            });
            this.client.on("ready", function() {
                _this.connecting = false;
                _this.connected = true;
                console.log("Connected to redis server on port ", _this.config.getPort());
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.READY));
                if (!cbFired) {
                    cbFired = true;
                    callback();
                }
            });
            this.client.on("message", function(channel, message) {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.MESSAGE, {
                    channel: channel,
                    message: message
                }));
            });
            this.client.on("subscribe", function(channel, count) {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.SUBSCRIBE, {
                    channel: channel,
                    count: count
                }));
            });
            this.client.on("unsubscribe", function(channel, count) {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.UNSUBSCRIBE, {
                    channel: channel,
                    count: count
                }));
            });
        }
    },

    /**
     *
     */
    quit: function() {
        this.client.quit();
    },


    //-------------------------------------------------------------------------------
    // Proxy Methods
    //-------------------------------------------------------------------------------

    bRPopLPush: function() {
        return this.client.brpoplpush.apply(this.client, arguments);
    },

    del: function() {
        return this.client.del.apply(this.client, arguments);
    },

    exists: function() {
        return this.client.exists.apply(this.client, arguments);
    },

    get: function() {
        return this.client.get.apply(this.client, arguments);
    },

    getRange: function() {
        return this.client.getrange.apply(this.client, arguments);
    },

    lPush: function() {
        return this.client.lpush.apply(this.client, arguments);
    },

    lRem: function() {
        return this.client.lrem.apply(this.client, arguments);
    },

    multi: function() {
        return this.client.multi.apply(this.client, arguments);
    },

    publish: function() {
        return this.client.publish.apply(this.client, arguments);
    },

    rPopLPush: function() {
        return this.client.rpoplpush.apply(this.client, arguments);
    },

    sAdd: function() {
        return this.client.sadd.apply(this.client, arguments);
    },

    set: function() {
        return this.client.set.apply(this.client, arguments);
    },

    setNX: function() {
        return this.client.setnx.apply(this.client, arguments);
    },

    sMembers: function() {
        return this.client.smembers.apply(this.client, arguments);
    },

    sRem: function() {
        return this.client.srem.apply(this.client, arguments);
    },

    subscribe: function(channel, callback) {
        return this.client.subscribe.apply(this.client, arguments);
    },

    unsubscribe: function() {
        return this.client.unsubscribe.apply(this.client, arguments);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.RedisClient', RedisClient);
