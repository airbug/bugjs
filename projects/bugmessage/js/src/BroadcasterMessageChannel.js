//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('BroadcasterMessageChannel')

//@Require('Class')
//@Require('List')
//@Require('bugmessage.AbstractMessageChannel')
//@Require('bugmessage.IBroadcasterChannel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var List                    = bugpack.require('List');
var AbstractMessageChannel  = bugpack.require('bugmessage.AbstractMessageChannel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BroadcasterMessageChannel = Class.extend(AbstractMessageChannel, {

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
    // Instance Methods
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
