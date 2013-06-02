//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('IMessageReceiver')

//@Require('Interface')
//@Require('bugmessage.IMessageChannel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface       = bugpack.require('Interface');
var IMessageChannel = bugpack.require('bugmessage.IMessageChannel');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 */
var IMessageReceiver = Interface.extend(IMessageChannel, {

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    receiveMessage: function(message, messageResponder) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.IMessageReceiver', IMessageReceiver);
