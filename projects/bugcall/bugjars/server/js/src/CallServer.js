//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallServer')
//@Autoload

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallServerConnection')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('socketio:server.SocketIoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Event                       = bugpack.require('Event');
var EventDispatcher             = bugpack.require('EventDispatcher');
var Set                         = bugpack.require('Set');
var CallConnection              = bugpack.require('bugcall.CallConnection');
var CallServerConnection        = bugpack.require('bugcall.CallServerConnection');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule           = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var SocketIoManager             = bugpack.require('socketio:server.SocketIoManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


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

    _constructor: function(socketIoManager, marshaller) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<CallConnection>}
         */
        this.callConnectionSet      = new Set();

        /**
         * @private
         * @type {boolean}
         */
        this.initialized            = false;

        /**
         * @private
         * @type {Marshaller}
         */
        this.marshaller             = marshaller;

        /**
         * @private
         * @type {SocketIoManager}
         */
        this.socketIoManager        = socketIoManager;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Marshaller}
     */
    getMarshaller: function() {
        return this.marshaller;
    },

    /**
     * @return {SocketIoManager}
     */
    getSocketIoManager: function() {
        return this.socketIoManager;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        if (this.isInitialized()) {
            this.initialized = false;
            this.socketIoManager.removeEventListener(SocketIoManager.EventTypes.CONNECTION, this.hearManagerConnection, this);
            console.log("callServer deinitialized");
        }
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.socketIoManager.addEventListener(SocketIoManager.EventTypes.CONNECTION, this.hearManagerConnection, this);
            console.log("callServer initialized");
        }
        callback();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
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
        this.dispatchEvent(new Event(CallServer.EventTypes.CONNECTION_ESTABLISHED, {
            callConnection: callConnection
        }));
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearManagerConnection: function(event) {
        var socketConnection = event.getData().socketConnection;
        var callConnection = new CallServerConnection(socketConnection, this.marshaller);
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
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(CallServer, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallServer).with(
    module("callServer")
        .args([
            arg().ref("socketIoManager"),
            arg().ref("marshaller")
        ])
);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallServer', CallServer);
