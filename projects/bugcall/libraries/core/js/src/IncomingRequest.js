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

//@Export('bugcall.IncomingRequest')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IObjectable     = bugpack.require('IObjectable');
    var Obj             = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IObjectable}
     */
    var IncomingRequest = Class.extend(Obj, {

        _name: "bugcall.IncomingRequest",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CallRequest} callRequest
         * @param {Call} call
         */
        _constructor: function(callRequest, call) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Call}
             */
            this.call = call;

            /**
             * @private
             * @type {CallRequest}
             */
            this.callRequest = callRequest;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CallConnection}
         */
        getCallConnection: function() {
            return this.call.getConnection();
        },

        /**
         * @return {Call}
         */
        getCall: function() {
            return this.call;
        },

        /**
         * @return {string}
         */
        getCallUuid: function() {
            return this.call.getCallUuid();
        },

        /**
         * @return {CallRequest}
         */
        getCallRequest: function() {
            return this.callRequest;
        },

        /**
         * @return {*}
         */
        getData: function() {
            return this.callRequest.getData();
        },

        /**
         * @return {Object}
         */
        getHandshake: function() {
            return this.getCallConnection().getHandshake();
        },

        /**
         * @return {string}
         */
        getType: function() {
            return this.callRequest.getType();
        },

        /**
         * @return {string}
         */
        getUuid: function() {
            return this.callRequest.getUuid();
        },


        //-------------------------------------------------------------------------------
        // IObjectable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        toObject: function() {
            return this.callRequest.toObject();
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(IncomingRequest, IObjectable);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.IncomingRequest', IncomingRequest);
});
