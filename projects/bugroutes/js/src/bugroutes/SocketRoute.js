//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

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

var SocketRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(messageType, listener){

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(...)}
         */
        this.listener       = listener;

        /**
         * @private
         * @type {string}
         */
        this.messageType    = messageType;
    },

    /**
     * @param {SocketIoConnection | socket} socket
     * @param {{*}} data
     */
    fire: function(socket, data) {
        this.listener(socket, data);
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
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {SocketIoConnection} socket
     * @param {Object} message
     */
    route: function(socket, message) {
        this.listener.call(null, socket, message);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.SocketRoute', SocketRoute);
