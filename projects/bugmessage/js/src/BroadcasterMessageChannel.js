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

//@Export('bugmessage.BroadcasterMessageChannel')

//@Require('Class')
//@Require('List')
//@Require('bugmessage.AbstractMessageChannel')
//@Require('bugmessage.IBroadcasterChannel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var List                    = bugpack.require('List');
    var AbstractMessageChannel  = bugpack.require('bugmessage.AbstractMessageChannel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractMessageChannel}
     */
    var BroadcasterMessageChannel = Class.extend(AbstractMessageChannel, {

        _name: "bugmessage.BroadcasterMessageChannel",


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
             * @type {Object}
             */
            this.messageReceiverList = new List();
        },


        //-------------------------------------------------------------------------------
        // AbstractMessageChannel Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        doChannelMessage: function(message, messageResponder) {
            var messageReceiverListClone = this.messageReceiverList.clone();
            messageReceiverListClone.forEach(function(messageReceiver) {
                messageReceiver.receiveMessage(message, messageResponder);
            });
        },


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {MessageReceiver} messageReceiver
         * @return {boolean}
         */
        addMessageReceiver: function(messageReceiver) {
            if (!this.messageReceiverList.contains(messageReceiver)) {
                this.messageReceiverList.add(messageReceiver);
                messageReceiver.addEventPropagator(this);
                return true;
            }
            return false;
        },

        /**
         * @return {number}
         */
        getMessageReceiverCount: function() {
            return this.messageReceiverList.getCount();
        },

        /**
         * @param {MessageReceiver} messageReceiver
         * @return {boolean}
         */
        hasMessageReceiver: function(messageReceiver) {
            return this.messageReceiverList.contains(messageReceiver);
        },

        /**
         * @return {boolean}
         */
        isMessageReceiverListEmpty: function() {
            return this.messageReceiverList.isEmpty();
        },

        /**
         * @param {MessageReceiver} messageReceiver
         * @return {boolean}
         */
        removeMessageReceiver: function(messageReceiver) {
            var result = this.messageReceiverList.remove(messageReceiver);
            if (result) {
                messageReceiver.removeEventPropagator(this);
            }
            return result;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.BroadcasterMessageChannel', BroadcasterMessageChannel);
});
