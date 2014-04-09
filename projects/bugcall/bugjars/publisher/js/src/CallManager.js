//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallManager')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Exception                   = bugpack.require('Exception');
var Obj                         = bugpack.require('Obj');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var BugTrace                    = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;
var $traceWithError             = BugTrace.$traceWithError;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IInitializeModule}
 */
var CallManager = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Logger} logger
     * @param {RedisClient} redisClient
     * @param {PersistedCallFactory} persistedCallFactory
     */
    _constructor: function(logger, redisClient, persistedCallFactory) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                         = logger;

        /**
         * @private
         * @type {PersistedCallFactory}
         */
        this.persistedCallFactory           = persistedCallFactory;

        /**
         * @private
         * @type {RedisClient}
         */
        this.redisClient                    = redisClient;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },

    /**
     * @returns {PersistedCallFactory}
     */
    getPersistedCallFactory: function() {
        return this.persistedCallFactory;
    },

    /**
     * @return {RedisClient}
     */
    getRedisClient: function() {
        return this.redisClient;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {PersistedCall} persistedCall
     * @param {function(Throwable, boolean=)} callback
     */
    setCall: function(persistedCall, callback) {
        var persistedCallData   = this.persistedCallFactory.unbuildPersistedCall(persistedCall);
        var callKey             = this.generateCallKey(persistedCall.getCallUuid());
        this.redisClient.set(callKey, JSON.stringify(persistedCallData), $traceWithError(function(error, reply) {
            if (!error) {
                callback(null, reply);
            } else {
                callback(new Exception("RedisError", {}, "Error occurred in Redis", [error]));
            }
        }));
    },

    /**
     *
     * @param {string} callUuid
     * @param {function(Throwable, PersistedCall=)} callback
     */
    getCallByCallUuid: function(callUuid, callback) {
        var _this               = this;
        var callKey             = this.generateCallKey(callUuid);
        this.redisClient.get(callKey, $traceWithError(function(error, reply) {
            if (!error) {
                if (reply) {
                    var persistedCall = _this.persistedCallFactory.buildPersistedCall(JSON.parse(reply));
                    callback(null, persistedCall);
                } else {
                    callback(null, null);
                }
            } else {
                callback(new Exception("RedisError", {}, "Error occurred in Redis", [error]));
            }
        }));
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable, boolean=)} callback
     */
    hasCallForCallUuid: function(callUuid, callback) {
        var callKey             = this.generateCallKey(callUuid);
        this.redisClient.exists(callKey, $traceWithError(function(error, reply) {
            if (!error) {
                callback(null, !!reply);
            } else {
                callback(new Exception("RedisError", {}, "Error occurred in Redis", [error]));
            }
        }));
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable, boolean=)} callback
     */
    removeCallByCallUuid: function(callUuid, callback) {
        var callKey             = this.generateCallKey(callUuid);
        this.redisClient.del(callKey, $traceWithError(function(error, reply) {
            if (!error) {
                callback(null, !!reply);
            } else {
                callback(new Exception("RedisError", {}, "Error occurred in Redis", [error]));
            }
        }));
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @returns {string}
     */
    generateCallKey: function(callUuid) {
        return "call:" + callUuid;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallManager).with(
    module("callManager")
        .args([
            arg().ref("logger"),
            arg().ref("redisClient"),
            arg().ref("persistedCallFactory")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallManager', CallManager);
