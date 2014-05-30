//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('socketio:socket.SocketIoConnection')

//@Require('ArgUtil')
//@Require('Class')
//@Require('EventReceiver')
//@Require('Map')
//@Require('NodeJsEvent')
//@Require('TypeUtil')
//@Require('socketio:socket.SocketIoEmit')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil         = bugpack.require('ArgUtil');
var Class           = bugpack.require('Class');
var EventReceiver   = bugpack.require('EventReceiver');
var Map             = bugpack.require('Map');
var NodeJsEvent     = bugpack.require('NodeJsEvent');
var TypeUtil        = bugpack.require('TypeUtil');
var SocketIoEmit    = bugpack.require('socketio:socket.SocketIoEmit');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoConnection = Class.extend(EventReceiver, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socket, connected) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.connected              = connected;

        /**
         * @private
         * @type {Map.<string, function(...)>}}
         */
        this.eventListenerAdapters  = new Map();

        /**
         * @private
         * @type {*}
         */
        this.socket                 = socket;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getConnected: function() {
        return this.connected;
    },

    /**
     * @return {*}
     */
    getSocket: function() {
        return this.socket;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isConnected: function() {
        return this.connected;
    },


    //-------------------------------------------------------------------------------
    // EventReceiver Extensions/Overrides
    //-------------------------------------------------------------------------------

    /**
     * @param {(string | Array.<string>)} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     * @param {?boolean=} once (optional)
     */
    addEventListener: function(eventType, listenerFunction, listenerContext, once) {
        this._super(eventType, listenerFunction, listenerContext, once);
        this.addEventListenerAdapter(eventType);
    },

    /**
     *
     */
    removeAllListeners: function() {
        this._super();
        var _this = this;
        this.eventListenerAdapters.getKeyArray().forEach(function(eventType) {
            _this.removeEventListenerAdapter(eventType);
        });
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext
     */
    removeEventListener: function(eventType, listenerFunction, listenerContext) {
        this._super(eventType, listenerFunction, listenerContext);
        if (!this.isListening(eventType)) {
            this.removeEventListenerAdapter(eventType);
        }
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    connect: function() {
        if (!this.isConnected()) {
            this.socket.connect();
        }
    },

    /**
     *
     */
    disconnect: function() {
        if (this.isConnected()) {
            this.socket.disconnect();
        }
    },

    destroyConnection: function() {
        this.socket = null;
    },

    /**
     * @param {string} emitName
     * @param {Object} emitData
     * @param {function(data)} callback
     */
    emit: function(emitName, emitData, callback) {
        if (this.isConnected()) {
            var socketIoEmit = new SocketIoEmit(emitName, emitData, callback);
            this.processEmit(socketIoEmit);
        } else {
            throw new Error("Socket is no longer connected.");
        }
    },

    /**
     * @param {Object} messageData
     * @param {function(data)} callback
     */
    send: function(messageData, callback) {
        this.emit("message", messageData, callback);
    },

    /**
     *
     */
    terminate: function() {
        this.emit("terminate", {}, function(data) {});
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {(string | Array.<string>)} eventType
     */
    addEventListenerAdapter: function(eventType) {
        var _this = this;
        if (TypeUtil.isArray(eventType)) {
            eventType.forEach(function(type) {
                _this.attachEventListenerAdapter(type);
            })
        } else {
            this.attachEventListenerAdapter(eventType);
        }
    },

    /**
     * @private
     * @param {string} eventType
     */
    attachEventListenerAdapter: function(eventType) {
        var _this = this;
        if (!this.hasEventListenerAdapter(eventType)) {
            var eventListenerAdapter = function() {
                var args = ArgUtil.toArray(arguments);
                var nodeJsEvent = new NodeJsEvent(eventType, args);
                nodeJsEvent.setTarget(_this.getTarget());
                _this.propagateEvent(nodeJsEvent);
            };
            this.socket.addListener(eventType, eventListenerAdapter);
            this.eventListenerAdapters.put(eventType, eventListenerAdapter);
        }
    },

    /**
     * @private
     * @param {string} eventType
     * @return {function(...)}
     */
    getEventListenerAdapter: function(eventType) {
        return this.eventListenerAdapters.get(eventType);
    },

    /**
     * @private
     * @param {string} eventType
     * @return {boolean}
     */
    hasEventListenerAdapter: function(eventType) {
        return this.eventListenerAdapters.containsKey(eventType);
    },

    /**
     * @private
     * @param {string} eventType
     */
    removeEventListenerAdapter: function(eventType) {
        var eventListenerAdapter = this.getEventListenerAdapter(eventType);
        if (eventListenerAdapter) {
            this.socket.removeListener(eventType, eventListenerAdapter);
            this.eventListenerAdapters.remove(eventType);
        }
    },

    /**
     * @private
     */
    deinitialize: function() {
        this.socket.removeAllListeners();
    },

    /**
     * @private
     */
    initialize: function() {
        this.on("connect",       this.hearConnect,      this);
        this.on("disconnect",    this.hearDisconnect,   this);
        this.on("terminate",     this.hearTerminate,    this);
    },

    /**
     * @private
     * @param {SocketIoEmit} socketIoEmit
     */
    processEmit: function(socketIoEmit) {
        this.socket.emit(socketIoEmit.getName(), socketIoEmit.getData());
        socketIoEmit.getCallback()();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearConnect: function(event) {
        this.connected = true;
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearDisconnect: function(event) {
        this.connected = false;
        // this.deinitialize();
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearTerminate: function(event) {
        this.disconnect();
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SocketIoConnection.EventTypes = {
    DISCONNECT: "disconnect",
    MESSAGE:    "message"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:socket.SocketIoConnection', SocketIoConnection);
