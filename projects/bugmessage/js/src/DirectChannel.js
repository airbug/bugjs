//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DirectChannel')

//@Require('Class')
//@Require('bugmessage.AbstractMessageChannel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AbstractMessageChannel  = bugpack.require('bugmessage.AbstractMessageChannel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DirectChannel = Class.extend(AbstractMessageChannel, {

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
    setMessageChannel: function(messageReceiver) {
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

bugpack.export('bugmessage.DirectChannel', DirectChannel);
