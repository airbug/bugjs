//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('IMessageChannel')

//@Require('IEventPropagator')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var IEventPropagator    = bugpack.require('IEventPropagator');
var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 * @extends {IEventDispatcher}
 */
var IMessageChannel = Interface.extend(IEventPropagator, {

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    channelMessage: function(message, messageResponder) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.IMessageChannel', IMessageChannel);
