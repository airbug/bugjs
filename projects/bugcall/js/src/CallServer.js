//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallServer')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallServerConnection')
//@Require('socketio:server.SocketIoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Event                   = bugpack.require('Event');
var EventDispatcher         = bugpack.require('EventDispatcher');
var Set                     = bugpack.require('Set');
var CallConnection          = bugpack.require('bugcall.CallConnection');
var CallServerConnection    = bugpack.require('bugcall.CallServerConnection');
var SocketIoManager         = bugpack.require('socketio:server.SocketIoManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EventDispatcher}
 */
var CallServer = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoManager) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<CallConnection>}
         */
        this.callConnectionSet = new Set();

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {SocketIoManager}
         */
        this.socketIoManager = socketIoManager;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    addCallConnection: function(callConnection) {
        callConnection.addEventListener(CallConnection.EventTypes.CLOSED, this.hearConnectionClosed, this);
        this.callConnectionSet.add(callConnection);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    removeCallConnection: function(callConnection) {
        this.callConnectionSet.remove(callConnection);
        callConnection.removeEventListener(CallConnection.EventTypes.CLOSED, this.hearConnectionClosed, this);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     * @param {boolean} failed
     */
    dispatchConnectionClosed: function(callConnection, failed) {
        this.dispatchEvent(new Event(CallServer.EventTypes.CONNECTION_CLOSED, {
            callConnection: callConnection,
            failed: failed
        }));
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    dispatchConnectionEstablished: function(callConnection) {
        console.log("Inside CallServer#dispatchConnectionEstablished");
        this.dispatchEvent(new Event(CallServer.EventTypes.CONNECTION_ESTABLISHED, {
            callConnection: callConnection
        }));
    },

    /**
     * @private
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.socketIoManager.addEventListener(SocketIoManager.EventTypes.CONNECTION, this.hearManagerConnection, this);
            console.log("callServer initialized");
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearManagerConnection: function(event) {
        console.log("Inside CallServer#hearManagerConnection");
        var socketConnection = event.getData().socketConnection;
        var callConnection = new CallServerConnection(socketConnection);
        this.addCallConnection(callConnection);
        this.dispatchConnectionEstablished(callConnection);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearConnectionClosed: function(event) {
        var callConnection = event.getTarget();
        this.removeCallConnection(callConnection);
        this.dispatchConnectionClosed(callConnection, event.getData().failed);
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
CallServer.EventTypes = {
    CONNECTION_CLOSED: "CallServer:ConnectionClosed",
    CONNECTION_ESTABLISHED: "CallServer:ConnectionEstablished"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallServer', CallServer);
