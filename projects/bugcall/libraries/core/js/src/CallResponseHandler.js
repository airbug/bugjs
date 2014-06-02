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

//@Export('bugcall.CallResponseHandler')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CallResponseHandler = Class.extend(Obj, {

        _name: "bugcall.CallResponseHandler",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Throwable, CallResponse=)} responseHandlerFunction
         * @param {Object=} responseHandlerContext
         */
        _constructor: function(responseHandlerFunction, responseHandlerContext) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.responseHandlerContext     = responseHandlerContext;

            /**
             * @private
             * @type {function(Throwable, CallResponse=)}
             */
            this.responseHandlerFunction    = responseHandlerFunction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getResponseHandlerContext: function() {
            return this.responseHandlerContext;
        },

        /**
         * @return {function(Throwable, CallResponse=)}
         */
        getResponseHandlerFunction: function() {
            return this.responseHandlerFunction;
        },


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Throwable} throwable
         * @param {CallResponse} callResponse
         */
        handle: function(throwable, callResponse) {
            this.responseHandlerFunction.call(this.responseHandlerContext, throwable, callResponse);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallResponseHandler', CallResponseHandler);
});
