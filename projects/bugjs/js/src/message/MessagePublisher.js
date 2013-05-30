/*
 * NOTE: Use this class when you want to split messages between receivers based on message topic
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessagePublisher')

//@Require('Class')
//@Require('IMessagePropagator')
//@Require('List')
//@Require('MessageBroadcaster')
//@Require('MessagePropagator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessagePropagator  = bugpack.require('IMessagePropagator');
var Map                 = bugpack.require('Map');
var MessageBroadcaster  = bugpack.require('MessageBroadcaster');
var MessagePropagator   = bugpack.require('MessagePropagator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessagePublisher = Class.extend(MessagePropagator, {

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
    // IMessagePropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    propagateMessage: function(message, channel) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(message.getTopic());
        if (messageBroadcaster) {
            messageBroadcaster.propagateMessage(message, channel);
        }
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} messageTopic
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    addMessagePropagatorForTopic: function(messageTopic, messagePropagator) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
        if (!messageBroadcaster) {
            messageBroadcaster = new MessageBroadcaster();
            messageBroadcaster.addEventPropagator(this);
            this.messageTopicToMessageBroadcasterMap.put(messageTopic, messageBroadcaster);
        }
        if (!messageBroadcaster.hasMessagePropagator(messagePropagator)) {
            messageBroadcaster.addMessagePropagator(messagePropagator);
            return true;
        }
        return false;
    },

    /**
     * @param {string} messageTopic
     * @return {boolean}
     */
    hasMessagePropagatorForTopic: function(messageTopic) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
        if (messageBroadcaster) {
            return !messageBroadcaster.isMessagePropagatorListEmpty();
        }
        return false;
    },

    /**
     * @param {string} messageTopic
     * @param {MessagePropagator} messagePropagator
     * @return {boolean}
     */
    removeMessagePropagatorForTopic: function(messageTopic, messagePropagator) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
        if (messageBroadcaster) {
            var result = messageBroadcaster.removeMessagePropagator(messagePropagator);
            if (messageBroadcaster.isMessagePropagatorListEmpty()) {
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

Class.implement(MessagePublisher, IMessagePropagator);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessagePublisher', MessagePublisher);
