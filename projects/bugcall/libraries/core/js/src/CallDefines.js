//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallDefines = {};


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
CallDefines.MessageTypes = {
    CALL_REQUEST: "CallDefines:CallRequest",
    CALL_RESPONSE: "CallDefines:CallResponse",
    CALL_THROWABLE: "CallDefines:CallThrowable"
};

/**
 * @static
 * @enum {string}
 */
CallDefines.CallState = {
    STARTED: "CallState:Started",
    STOPPED: "CallState:Stopped",
    STOPPING: "CallState:Stopping"
};

/**
 * @static
 * @enum {string}
 */
CallDefines.ConnectionState = {
    CLOSED: "ConnectionState:Closed",
    CLOSING: "ConnectionState:Closing",
    OPEN: "ConnectionState:Open",
    OPENING: "ConnectionState:Opening"
};



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("bugcall.CallDefines", CallDefines);
