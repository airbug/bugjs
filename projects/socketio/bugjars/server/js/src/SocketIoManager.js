//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:server')

//@Export('SocketIoServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();
var io              = require('socket.io');


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var BugFlow         = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $parallel           = BugFlow.$parallel;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoManager = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoServer, namespace) {

        this._super();

        /**
         * @private
         * @type {*}
         */
        this.ioManager = socketIoServer.of(namespace);

        /**
         * @private
         * @type {SocketIoServer}
         */
        this.socketIoServer  = socketIoServer;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    initialize: function() {
        this.ioManager.on("connection", function(socket) {

        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:server.SocketIoManager', SocketIoManager);
