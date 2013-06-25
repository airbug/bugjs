//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:server')

//@Export('SocketIoManager')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('bugflow.BugFlow')
//@Require('socketio:socket.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();
var io              = require('socket.io');


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var SocketIoConnection  = bugpack.require('socketio:socket.SocketIoConnection');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoManager = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {SocketIoServer} socketIoServer
     * @param {string} namespace
     */
    _constructor: function(socketIoServer, namespace) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.ioManager          = socketIoServer.of(namespace);

        /**
         * @private
         * @type {SocketIoServer}
         */
        this.socketIoServer     = socketIoServer;

        /**
         * @private
         * @type {Map.<string, SocketIoConnection>}
         */
        this.socketUuidToSocketConnectionMap = new Map();

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} socketUuid
     * @return {SocketIoConnection}
     */
    getSocketConnection:function(socketUuid) {
        return this.socketUuidToSocketConnectionMap.get(socketUuid);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        var _this = this;
        this.ioManager.on("connection", function(socket) {
            var socketConnection = new SocketIoConnection(socket, true);
            socketConnection.on(SocketIoConnection.EventTypes.DISCONNECT, _this.hearSocketDisconnect, _this);
            _this.socketUuidToSocketConnectionMap.put(socketConnection.getUuid(), socketConnection);
            _this.dispatchEvent(new Event(SocketIoManager.EventTypes.CONNECTION, {
                socketConnection: socketConnection
            }));
        });
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     *
     * @param event
     */
    hearSocketDisconnect: function(event) {
        var socketConnection = event.getTarget();
        this.socketUuidToSocketConnectionMap.remove(socketConnection.getUuid());
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SocketIoManager.EventTypes = {
    CONNECTION: "SocketIoManager:Connection"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:server.SocketIoManager', SocketIoManager);
