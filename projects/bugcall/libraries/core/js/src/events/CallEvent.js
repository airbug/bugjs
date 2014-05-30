//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Event           = bugpack.require('Event');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
CallEvent.CLOSED                = "CallEvent:Closed";

/**
 * @static
 * @const {string}
 */
CallEvent.INCOMING_REQUEST      = "CallEvent:IncomingRequest";

/**
 * @static
 * @const {string}
 */
CallEvent.OPENED                = "CallEvent:Opened";

/**
 * @static
 * @const {string}
 */
CallEvent.STARTED               = "CallEvent:Started";

/**
 * @static
 * @const {string}
 */
CallEvent.STOPPED               = "CallEvent:Stopped";

/**
 * @static
 * @const {string}
 */
CallEvent.STOPPING              = "CallEvent:Stopping";

/**
 * @static
 * @const {string}
 */
CallEvent.REQUEST_FAILED        = "CallEvent:RequestFailed";

/**
 * @static
 * @type {string}
 */
CallEvent.RESPONSE_FAILED       = "CallEvent:ResponseFailed";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallEvent', CallEvent);
