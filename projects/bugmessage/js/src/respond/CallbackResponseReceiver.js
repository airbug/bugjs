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

//@Export('bugmessage.CallbackResponseChannel')

//@Require('Class')
//@Require('bugmessage.AbstractResponseChannel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var AbstractResponseChannel     = bugpack.require('bugmessage.AbstractResponseChannel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractResponseChannel}
     */
    var CallbackResponseChannel = Class.extend(AbstractResponseChannel, {

        _name: "bugmessage.CallbackResponseChannel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Response)} receiverCallback
         * @param {Object} receiverContext
         */
        _constructor: function(receiverCallback, receiverContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Response)}
             */
            this.receiverCallback = receiverCallback;

            /**
             * @private
             * @type {Object}
             */
            this.receiverContext = receiverContext;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(Response)}
         */
        getReceiverCallback: function() {
            return this.receiverCallback;
        },

        /**
         * @return {Object}
         */
        getReceiverContext: function() {
            return this.receiverContext;
        },


        //-------------------------------------------------------------------------------
        // AbstractResponseReceiver Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        doCloseReceiver: function() {
            this.receiverContext = null;
            this.receiverCallback = null;
        },

        /**
         * @param {Response} response
         */
        doReceiveResponse: function(response) {
            this.receiverCallback.call(this.receiverContext, response);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.CallbackResponseChannel', CallbackResponseChannel);
});
