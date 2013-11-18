//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroute:socketio')

//@Export('SocketRoute')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var SocketRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} messageType
     * @param {function(SocketIoConnection, Object, function(Throwable))} listener
     */
    _constructor: function(messageType, listener) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(SocketIoConnection, Object, function(Throwable))}
         */
        this.listener       = listener;

        /**
         * @private
         * @type {string}
         */
        this.messageType    = messageType;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(...)}
     */
    getListener: function() {
        return this.listener;
    },

    /**
     * @return {string}
     */
    getMessageType: function() {
        return this.messageType;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {SocketIoConnection} socket
     * @param {Object} message
     * @param {function(Throwable)} callback
     */
    route: function(socket, message, callback) {
        this.listener.call(null, socket, message, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroute:socketio.SocketRoute', SocketRoute);
