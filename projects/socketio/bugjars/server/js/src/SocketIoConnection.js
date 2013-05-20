//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:server')

//@Export('SocketIoConnection')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Event           = bugpack.require('Event');
var EventDispatcher = bugpack.require('EventDispatcher');
var UuidGenerator   = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoConnection = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socket) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.socket = socket;

        /**
         * @private
         * @type {string}
         */
        this.uuid = UuidGenerator.generateUuid();

        var _this = this;
        this.socket.on("disconnect", function(data) {
            _this.dispatchEvent(new Event(SocketIoConnection.EventTypes.DISCONNECT));
        });
        this.socket.on("message", function(data) {
            _this.dispatchEvent(new Event(SocketIoConnection.EventTypes.MESSAGE, {data: data}));
        });
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {string}
     */
    getUuid: function() {
        return this.uuid;
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SocketIoConnection.EventTypes = {
    DISCONNECT: "SocketIoConnection:Disconnect",
    MESSAGE:    "SocketIoConnection:Message"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:server.SocketIoConnection', SocketIoConnection);
