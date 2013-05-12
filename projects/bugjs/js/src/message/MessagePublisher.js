/*
 * NOTE: Use this class when you want to split messages between receivers based on message topic
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessagePublisher')

//@Require('Class')
//@Require('IMessageReceiver')
//@Require('List')
//@Require('MessageBroadcaster')
//@Require('Obj')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessageReceiver    = bugpack.require('IMessageReceiver');
var Map                 = bugpack.require('Map');
var MessageBroadcaster  = bugpack.require('MessageBroadcaster');
var Obj                 = bugpack.require('Obj');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessagePublisher = Class.extend(Obj, {

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
         * @type {string}
         */
        this.address = UuidGenerator.generateUuid();

        /**
         * @private
         * @type {Map.<string, MessageBroadcaster>}
         */
        this.messageTopicToMessageBroadcasterMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // IMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAddress: function() {
        return this.address;
    },

    /**
     * @param {Message} message
     * @param {
     */
    receiveMessage: function(message) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(message.getTopic());
        if (messageBroadcaster) {
            messageBroadcaster.receiveMessage(message);
        }
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} messageTopic
     * @param {MessageReceiver} messageReceiver
     * @return {boolean}
     */
    addMessageReceiverForTopic: function(messageTopic, messageReceiver) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
        if (!messageBroadcaster) {
            messageBroadcaster = new MessageBroadcaster();
            this.messageTopicToMessageBroadcasterMap.put(messageTopic, messageBroadcaster);
        }
        if (!messageBroadcaster.hasMessageReceiver(messageReceiver)) {
            messageBroadcaster.addMessageReceiver(messageReceiver);
            return true;
        }
        return false;
    },

    /**
     * @param {string} messageTopic
     * @return {boolean}
     */
    hasMessageReceiverForTopic: function(messageTopic) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
        if (messageBroadcaster) {
            return !messageBroadcaster.isMessageReceiverListEmpty();
        }
        return this.messageTopicToMessageBroadcasterMap.containsKey(messageTopic);
    },

    /**
     * @param {string} messageTopic
     * @param {MessageReceiver} messageReceiver
     * @return {boolean}
     */
    removeMessageReceiverForTopic: function(messageTopic, messageReceiver) {
        var messageBroadcaster = this.messageTopicToMessageBroadcasterMap.get(messageTopic);
        if (messageBroadcaster) {
            return messageBroadcaster.remove(messageReceiver);
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessagePublisher, IMessageReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessagePublisher', MessagePublisher);
