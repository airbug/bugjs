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

//@Export('bugcall.CallResponder')

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallResponse')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var CallResponse    = bugpack.require('bugcall.CallResponse');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CallResponder = Class.extend(Obj, {

        _name: "bugcall.CallResponder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Call} call
         * @param {IncomingRequest} incomingRequest
         */
        _constructor: function(call, incomingRequest) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Call}
             */
            this.call        = call;

            /**
             * @private
             * @type {IncomingRequest}
             */
            this.incomingRequest    = incomingRequest;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} responseType
         * @param {*=} responseData
         * @return {CallResponse}
         */
        response: function(responseType, responseData) {
            return new CallResponse(responseType, responseData, this.incomingRequest.getUuid());
        },

        /**
         * @param {CallResponse} callResponse
         * @param {function(Throwable=)} callback
         */
        sendResponse: function(callResponse, callback) {
            this.call.sendResponse(callResponse, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallResponder', CallResponder);
});
