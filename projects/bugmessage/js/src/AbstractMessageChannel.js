//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmessage.AbstractMessageChannel')

//@Require('Class')
//@Require('EventPropagator')
//@Require('bugmessage.IMessageChannel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventPropagator     = bugpack.require('EventPropagator');
var IMessageChannel     = bugpack.require('bugmessage.IMessageChannel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AbstractMessageChannel = Class.extend(EventPropagator, {

    /**
     * @abstract
     * @param message
     * @param messageResponder
     */
    //doChannelMessage: function(message, messageResponder) {},


    //-------------------------------------------------------------------------------
    // IMessageChannel Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    channelMessage: function(message, messageResponder) {
        this.doChannelMessage(message, messageResponder);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AbstractMessageChannel, IMessageChannel);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.AbstractMessageChannel', AbstractMessageChannel);
