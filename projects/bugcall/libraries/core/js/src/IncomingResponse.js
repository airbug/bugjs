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

//@Export('bugcall.IncomingResponse')

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
    var IncomingResponse = Class.extend(Obj, {

        _name: "bugcall.IncomingResponse",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CallResponse} callResponse
         * @param {Call} call
         */
        _constructor: function(callResponse, call) {

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
             * @type {CallResponse}
             */
            this.callResponse = callResponse;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

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
         * @return {CallResponse}
         */
        getCallResponse: function() {
            return this.callResponse;
        },

        /**
         * @return {*}
         */
        getData: function() {
            return this.callResponse.getData();
        },

        /**
         * @return {string}
         */
        getRequestUuid: function() {
            return this.callResponse.getRequestUuid()
        },

        /**
         * @return {string}
         */
        getType: function() {
            return this.callResponse.getType();
        },

        /**
         * @return {string}
         */
        getUuid: function() {
            return this.callResponse.getUuid();
        },


        //-------------------------------------------------------------------------------
        // IObjectable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        toObject: function() {
            return this.callResponse.toObject();
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(IncomingResponse, IObjectable);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.IncomingResponse', IncomingResponse);
});
