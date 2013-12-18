//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('redis')

//@Export('RedisClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('redis.RedisEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var RedisEvent          = bugpack.require('redis.RedisEvent');


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
         * @type {RedisConfig}
         */
        this.config         = config;

        /**
         * @private
         * @type {boolean}
         */
        this.connected      = false;

        /**
         * @private
         * @type {boolean}
         */
        this.connecting     = false;

        /**
         * @private
         * @type {*}
         */
        this.redis          = redis;

        /**
         * @private
         * @type {*}
         */
        this.client         = null;
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


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    connect: function(callback) {
        var _this = this;
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
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.END));
            });
            this.client.on("error", function() {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.ERROR));
            });
            this.client.on("idle", function() {
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.IDLE));
            });
            this.client.on("ready", function() {
                console.log("Connected to redis server on port ", _this.config.getPort());
                _this.dispatchEvent(new RedisEvent(RedisEvent.EventTypes.READY));
                callback();
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Proxy Methods
    //-------------------------------------------------------------------------------

    get: function() {
        return this.client.get.apply(this.client, arguments);
    },

    getRange: function() {
        return this.client.getrange.apply(this.client, arguments);
    },

    set: function() {
        return this.client.set.apply(this.client, arguments);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('redis.RedisClient', RedisClient);
