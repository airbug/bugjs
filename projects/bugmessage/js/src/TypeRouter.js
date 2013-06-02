/*
 * NOTE: Use this class when you want to split messages between receivers based on message topic
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessagePublisher')

//@Require('Class')
//@Require('IMessageChannel')
//@Require('List')
//@Require('MessageBroadcaster')
//@Require('MessageChannel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


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

var MessagePublisher = Class.extend(MessageChannel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
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
