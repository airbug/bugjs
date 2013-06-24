//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallClientEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Event   = bugpack.require('Event');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallClientEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------


/**
 * @static
 * @const {string}
 */
CallClientEvent.CONNECTION_CLOSED = "CallClientEvent:ConnectionClosed";

/**
 * @static
 * @const {string}
 */
CallClientEvent.CONNECTION_OPENED = "CallClientEvent:ConnectionOpened";

/**
 * @static
 * @const {string}
 */
CallClientEvent.RETRY_FAILED = "CallClientEvent:RetryFailed";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallClientEvent', CallClientEvent);


