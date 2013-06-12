//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('SocketRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('socketio:server.SocketIoManager')
//@Require('socketio:socket.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var SocketIoManager     = bugpack.require('socketio:server.SocketIoManager');
var SocketIoConnection  = bugpack.require('socketio:socket.SocketIoConnection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketRouter = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {SocketIoManager} ioManager
     */
    _constructor: function(ioManager){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {}
         */
        this.ioManager = ioManager;

        /**
         * @private
         * @type {Map.<}
         */
        this.routesMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    initialize: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this = this;
        this.ioManager.on(SocketIoManager.EventTypes.CONNECTION, function(event){
            /** @type {SocketIoConnection} */
            var socketConnection = event.getData().socketConnection;
            socketConnection.on(SocketIoConnection.EventTypes.DISCONNECT, this.handleConnectionDisconnect, this);
            socketConnection.on(SocketIoConnection.EventTypes.MESSAGE, this.handleConnectionMessage, this);
        });

        callback();
    },

    /**
     * @param {SocketRoute} route
     */
    add: function(route){
        var messageType = route.getMessageType();
        if(this.routesMap.get(messageType) === null){
            this.routesMap.put(messageType, route);
        } else {
            throw new Error("The messageType " + messageType + " already exists in the routesMap");
        }

    },

    /**
     * @param {Array.<SocketRoute> | {*}} routes
     */
    addAll: function(routes){
        var _this = this;
        if(TypeUtil.isArray(routes)){
            routes.forEach(function(route){
                _this.add(route.getMessageType(), route);
            });
        } else if(TypeUtil.isObject(routes) && !TypeUtil.isFunction(routes)){
            for(var messageType in routes){
                _this.add(messageType, routes[messageType]);
                //NOTE: This might need refining. For example: does this add properties that are not routes?
            }
        } else {
            var routes = Array.prototype.slice.call(arguments);
            _this.addAll(routes);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listener
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleConnectionDisconnect: function(event) {
        var socketConnection = event.getTarget();
        socketConnection.removeEventListener(SocketIoConnection.EventTypes.DISCONNECT, this.handleConnectionDisconnect, this);
        socketConnection.removeEventListener(SocketIoConnection.EventTypes.MESSAGE, this.handleConnectionMessage, this);
    },

    /**
     * @private
     * @param {Event} event
     */
    handleConnectionMessage: function(event) {
        var message     = event.getData().message;
        var data        = message.data;
        var messageType = message.type;
        var socketRoute = this.routesMap.get(messageType);
        if(socketRoute) socketRoute.fire(socket, data);
        // use socket to get access to connection object via the ioManager
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.SocketRouter', SocketRouter);
