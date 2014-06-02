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

//@Export('bugmessage.DirectMessageChannel')

//@Require('Class')
//@Require('bugmessage.AbstractMessageChannel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var AbstractMessageChannel  = bugpack.require('bugmessage.AbstractMessageChannel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractMessageChannel}
     */
    var DirectMessageChannel = Class.extend(AbstractMessageChannel, {

        _name: "bugmessage.DirectMessageChannel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IMessageReceiver}
             */
            this.messageReceiver = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IMessageReceiver}
         */
        getMessageReceiver: function() {
            return this.messageReceiver;
        },

        /**
         * @param {IMessageReceiver} messageReceiver
         */
        setMessageReceiver: function(messageReceiver) {
            if (this.messageReceiver) {
                this.messageReceiver.removeEventPropagator(this);
            }
            this.messageReceiver = messageReceiver;
            this.messageReceiver.addEventPropagator(this);
        },


        //-------------------------------------------------------------------------------
        // AbstractMessageChannel Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        doChannelMessage: function(message, messageResponder) {
            this.messageReceiver.receiveMessage(message, messageResponder);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.DirectMessageChannel', DirectMessageChannel);
});
