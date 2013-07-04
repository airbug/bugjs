//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallManagerEvent')

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

var CallManagerEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @type {string}
 */
CallManagerEvent.CALL_CLOSED        = "CallManagerEvent:CallClosed";

/**
 * @static
 * @const {string}
 */
CallManagerEvent.INCOMING_REQUEST   = "CallManagerEvent:IncomingRequest";

/**
 * @static
 * @const {string}
 */
CallManagerEvent.REQUEST_FAILED     = "CallManagerEvent:RequestFailed";

/**
 * @static
 * @type {string}
 */
CallManagerEvent.RESPONSE_FAILED    = "CallManagerEvent:ResponseFailed";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallManagerEvent', CallManagerEvent);
