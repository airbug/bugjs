//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmessage.AbstractMessageReceiver')

//@Require('Class')
//@Require('EventPropagator')
//@Require('bugmessage.IMessageReceiver')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventPropagator     = bugpack.require('EventPropagator');
var IMessageReceiver    = bugpack.require('bugmessage.IMessageReceiver');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AbstractMessageReceiver = Class.extend(EventPropagator, {

    /**
     * @abstract
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    //doReceiveMessage: function(message, messageResponder) {},


    //-------------------------------------------------------------------------------
    // IMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    receiveMessage: function(message, messageResponder) {
        this.doReceiveMessage(message, messageResponder);
    }
});



//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AbstractMessageReceiver, IMessageReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.AbstractMessageReceiver', AbstractMessageReceiver);
