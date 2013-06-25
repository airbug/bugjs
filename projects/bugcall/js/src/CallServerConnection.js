//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallServerConnection')

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
var CallServerConnection = Class.extend(CallConnection, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketConnection) {

        this._super(socketConnection);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


    },


    //-------------------------------------------------------------------------------
    // CallConnection Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    doClose: function() {
        this.socketConnection.emit("callClosing");
        this.socketConnection.disconnect();
    },

    /**
     * @protected
     */
    doDeinitialize: function() {
        this._super();
        this.socketConnection.removeEventListener("callTerminate", this.hearCallTerminate, this);
    },

    /**
     * @protected
     */
    doInitialize: function() {
        this._super();
        this.socketConnection.addEventListener("callTerminate", this.hearCallTerminate, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearCallTerminate: function(event) {
        this.changeStateClosing();
        this.doClose();
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallServerConnection', CallServerConnection);
