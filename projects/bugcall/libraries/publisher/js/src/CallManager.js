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

//@Export('bugcall.CallManager')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Tracer')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Obj                 = bugpack.require('Obj');
    var Tracer              = bugpack.require('Tracer');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var $traceWithError     = Tracer.$traceWithError;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     */
    var CallManager = Class.extend(Obj, {

        _name: "bugcall.CallManager",


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

    bugmeta.tag(CallManager).with(
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
});
