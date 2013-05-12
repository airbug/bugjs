//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MessageSender')

//@Require('Class')
//@Require('IMessageSender')
//@Require('MessageDefines')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IMessageSender  = bugpack.require('IMessageSender');
var MessageDefines  = bugpack.require('MessageDefines');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MessageSender = Class.extend(Obj, {

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
         * @type {MessageReceiver}
         */
        this.messageReceiver = null;
    },


    //-------------------------------------------------------------------------------
    // Getters ans Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getMessageReceiver: function() {
        return this.messageReceiver;
    },

    /**
     * @param {MessageReceiver} messageReceiver
     */
    setMessageReceiver: function(messageReceiver) {
        this.messageReceiver = messageReceiver;
    },


    //-------------------------------------------------------------------------------
    // IMessageSender Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string=} channel
     */
    sendMessage: function(message, channel) {
        if (!channel) {
            channel = MessageDefines.MessageChannels.MESSAGE;
        }
        this.messageReceiver.receiveMessage(message, channel);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MessageSender, IMessageSender);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('MessageSender', MessageSender);
