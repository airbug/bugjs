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

//@Export('bugmessage.CallbackMessageReceiver')

//@Require('Class')
//@Require('bugmessage.AbstractMessageReceiver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var AbstractMessageReceiver     = bugpack.require('bugmessage.AbstractMessageReceiver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractMessageReceiver}
     */
    var CallbackMessageReceiver = Class.extend(AbstractMessageReceiver, {

        _name: "bugmessage.CallbackMessageReceiver",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Message, MessageResponder)} receiverCallback
         * @param {Object} receiverContext
         */
        _constructor: function(receiverCallback, receiverContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Message, MessageResponder)}
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
         * @return {function(Message, MessageResponder)}
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
        // AbstractMessageReceiver Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        doReceiveMessage: function(message, messageResponder) {
            this.receiverCallback.call(this.receiverContext, message, messageResponder);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.CallbackMessageReceiver', CallbackMessageReceiver);
});
