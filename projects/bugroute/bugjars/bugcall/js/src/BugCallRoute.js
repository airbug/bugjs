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

//@Export('bugroute.BugCallRoute')

//@Require('Class')
//@Require('Obj')
//@Require('bugroute.ICallRoute')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var ICallRoute  = bugpack.require('bugroute.ICallRoute');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ICallRoute}
     */
    var BugCallRoute = Class.extend(Obj, {

        _name: "bugroute.BugCallRoute",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} requestType
         * @param {function(CallRequest, CallResponder, function(Throwable))} listener
         */
        _constructor: function(requestType, listener) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(CallRequest, CallResponder, function(Throwable))} listener
             */
            this.listener       = listener;

            /**
             * @private
             * @type {string}
             */
            this.requestType    = requestType;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {function(CallRequest, CallResponder, function(Throwable))}
         */
        getListener: function() {
            return this.listener;
        },


        //-------------------------------------------------------------------------------
        // ICallRoute Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getRequestType: function() {
            return this.requestType;
        },

        /**
         * @param {CallRequest} request
         * @param {CallResponder} responder
         * @param {function(Throwable)} callback
         */
        route: function(request, responder, callback) {
            this.listener.call(null, request, responder, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(BugCallRoute, ICallRoute);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugroute.BugCallRoute', BugCallRoute);
});
