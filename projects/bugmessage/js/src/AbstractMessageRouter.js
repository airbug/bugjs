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

//@Export('bugmessage.AbstractMessageRouter')

//@Require('Class')
//@Require('List')
//@Require('bugmessage.AbstractMessageReceiver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var List                    = bugpack.require('List');
    var AbstractMessageReceiver = bugpack.require('bugmessage.AbstractMessageReceiver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {AbstractMessageReceiver}
     */
    var AbstractMessageRouter = Class.extend(AbstractMessageReceiver, {

        _name: "bugmessage.AbstractMessageRouter",


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
             * @type {List.<MessageChannel>}
             */
            this.messageChannelList = new List();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------
        // AbstractMessageReceiver Implementation
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        doReceiveMessage: function(message, messageResponder) {
            this.routeMessage(message, messageResponder);
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Message} message
         * @param {MessageResponder} messageResponder
         */
        //routeMessage: function(message, messageResponder) {},


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {MessageChannel} messageChannel
         * @return {boolean}
         */
        addMessageChannel: function(messageChannel) {
            if (!this.messageChannelList.contains(messageChannel)) {
                this.messageChannelList.add(messageChannel);
                messageChannel.addEventPropagator(this);
                return true;
            }
            return false;
        },

        /**
         * @return {number}
         */
        getMessageChannelCount: function() {
            return this.messageChannelList.getCount();
        },

        /**
         * @param {MessageChannel} messageChannel
         * @return {boolean}
         */
        hasMessageChannel: function(messageChannel) {
            return this.messageChannelList.contains(messageChannel);
        },

        /**
         * @return {boolean}
         */
        isMessageChannelListEmpty: function() {
            return this.messageChannelList.isEmpty();
        },

        /**
         * @param {MessageChannel} messageChannel
         * @return {boolean}
         */
        removeMessageChannel: function(messageChannel) {
            var result = this.messageChannelList.remove(messageChannel);
            if (result) {
                messageChannel.removeEventPropagator(this);
            }
            return result;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.AbstractMessageRouter', AbstractMessageRouter);
});
