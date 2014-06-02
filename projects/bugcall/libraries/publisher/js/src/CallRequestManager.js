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

//@Export('bugcall.CallRequestManager')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallRequest')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Exception                   = bugpack.require('Exception');
    var Obj                         = bugpack.require('Obj');
    var CallRequest                 = bugpack.require('bugcall.CallRequest');
    var BugFlow                     = bugpack.require('bugflow.BugFlow');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var ModuleTag            = bugpack.require('bugioc.ModuleTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var module                      = ModuleTag.module;
    var $series                     = BugFlow.$series;
    var $task                       = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CallRequestManager = Class.extend(Obj, {

        _name: "bugcall.CallRequestManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RedisClient} redisClient
         * @param {CallRequestFactory} callRequestFactory
         */
        _constructor: function(redisClient, callRequestFactory) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CallRequestFactory}
             */
            this.callRequestFactory     = callRequestFactory;

            /**
             * @private
             * @type {RedisClient}
             */
            this.redisClient            = redisClient;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CallRequestFactory}
         */
        getCallRequestFactory: function() {
            return this.callRequestFactory;
        },

        /**
         * @return {RedisClient}
         */
        getRedisClient: function() {
            return this.redisClient;
        }


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallRequestManager).with(
        module("callRequestManager")
            .args([
                arg().ref("redisClient"),
                arg().ref("callRequestFactory")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallRequestManager', CallRequestManager);
});
