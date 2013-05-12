//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageBroadcaster')

//@Require('Class')
//@Require('IMessageReceiver')
//@Require('List')
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
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageBroadcaster = Class.extend(Obj, {

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
         * @type {List.<MessageReceiver>}
         */
        this.messageReceiverList = new List();
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
     * @param {string} channel
     */
    receiveMessage: function(message, channel) {
        var messageReceiverListClone = this.messageReceiverList.clone();
        messageReceiverListClone.forEach(function(messageReceiver) {
            messageReceiver.receiveMessage(message, channel);
        });
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MessageReceiver} messageReceiver
     * @return {boolean}
     */
    addMessageReceiver: function(messageReceiver) {
        if (!this.messageReceiverList.contains(messageReceiver)) {
            this.messageReceiverList.add(messageReceiver);
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
        return this.messageReceiverList.remove(messageReceiver);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageBroadcaster, IMessageReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageBroadcaster', MessageBroadcaster);
