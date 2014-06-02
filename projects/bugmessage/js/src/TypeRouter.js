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

//@Export('bugmessage.MessagePublisher')

//@Require('Class')
//@Require('IMessageChannel')
//@Require('List')
//@Require('MessageBroadcaster')
//@Require('MessageChannel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var IMessageChannel  = bugpack.require('IMessageChannel');
    var Map                 = bugpack.require('Map');
    var MessageBroadcaster  = bugpack.require('MessageBroadcaster');
    var MessageChannel   = bugpack.require('MessageChannel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessageChannel}
     */
    var MessagePublisher = Class.extend(MessageChannel, {

        _name: "bugmessage.MessagePublisher",


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
             * @type {Map.<string, MessageBroadcaster>}
             */
            this.messageTopicToMessageBroadcasterMap = new Map();
        },


        //-------------------------------------------------------------------------------
        // IMessageChannel Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Message} message
         * @param {string} channel
         */
        channelMessage: function(message, channel) {
            var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(message.getTopic());
            if (messageBroadcaster) {
                messageBroadcaster.channelMessage(message, channel);
            }
        },


        //-------------------------------------------------------------------------------
        // Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} messageTopic
         * @param {MessageChannel} messageChannel
         * @return {boolean}
         */
        addMessageChannelForTopic: function(messageTopic, messageChannel) {
            var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
            if (!messageBroadcaster) {
                messageBroadcaster = new MessageBroadcaster();
                messageBroadcaster.addEventPropagator(this);
                this.messageTopicToMessageBroadcasterMap.put(messageTopic, messageBroadcaster);
            }
            if (!messageBroadcaster.hasMessageChannel(messageChannel)) {
                messageBroadcaster.addMessageChannel(messageChannel);
                return true;
            }
            return false;
        },

        /**
         * @param {string} messageTopic
         * @return {boolean}
         */
        hasMessageChannelForTopic: function(messageTopic) {
            var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
            if (messageBroadcaster) {
                return !messageBroadcaster.isMessageChannelListEmpty();
            }
            return false;
        },

        /**
         * @param {string} messageTopic
         * @param {MessageChannel} messageChannel
         * @return {boolean}
         */
        removeMessageChannelForTopic: function(messageTopic, messageChannel) {
            var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
            if (messageBroadcaster) {
                var result = messageBroadcaster.removeMessageChannel(messageChannel);
                if (messageBroadcaster.isMessageChannelListEmpty()) {
                    this.messageTopicToMessageBroadcasterMap.remove(messageTopic);
                    messageBroadcaster.removeEventPropagator(this);
                }
                return result;
            }
            return false;
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MessagePublisher, IMessageChannel);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('MessagePublisher', MessagePublisher);
});
