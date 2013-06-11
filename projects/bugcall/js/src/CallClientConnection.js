//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallClientConnection')

//@Require('Class')
//@Require('bugcall.CallConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var CallConnection  = bugpack.require('bugcall.CallConnection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {CallConnection}
 */
var CallClientConnection = Class.extend(CallConnection, {


    //-------------------------------------------------------------------------------
    // CallConnection Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    doClose: function() {
        this.socketConnection.emit("callTerminate");
    },

    /**
     * @protected
     */
    doDeinitialize: function() {
        this.socketConnection.removeEventListener("callClosing", this.hearCallClosing, this);
    },

    /**
     * @protected
     */
    doInitialize: function() {
        this.socketConnection.addEventListener("callClosing", this.hearCallClosing, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearCallClosing: function(event) {
        this.changeStateClosing();
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallClientConnection', CallClientConnection);
