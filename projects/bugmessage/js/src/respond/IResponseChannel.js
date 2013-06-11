//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmessage')

//@Export('IResponseChannel')

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
var IResponseChannel = Interface.extend(IEventPropagator, {

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Response} response
     */
    channelResponse: function(response) {},

    /**
     *
     */
    closeChannel: function() {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmessage.IResponseChannel', IResponseChannel);
