//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('SocketRoutesManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('socketio::server.SocketIoManager')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var SocketIoManager = bugpack.require('socketio::server.SocketIoManager');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketRoutesManager = Class.extend(Obj, {

    /*
     * @param {SocketIoManager} ioManager
     **/
    _constructor: function(ioManager){

        this._super();

        /*
         * @type {}
         **/
        this.ioManager  = ioManager;

        /*
         * @type {Map}
         **/
         this.routesMap = new Map();
    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    // ioManager listen for message and disconnect onto connection
    initialize: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this = this;
        this.ioManager.on(SocketIoManager.EventTypes.CONNECTION, function(event){
            /** @type {SocketIoConnection} */
            var socket = event.getData().socket;
            socket.on(SocketIoManager.EventTypes.MESSAGE, function(event){
                var message     = event.getData().message;
                var data        = message.data;
                var messageType = message.type;
                var socketRoute = _this.routesMap.get(messageType);
                if(socketRoute) socketRoute.fire(socket, data);
                // use socket to get access to connection object via the ioManager
            });
        });

        callback();
    },

    /*
     * @param {SocketRoute} route
     **/
    add: function(route){
        var messageType = route.getMessageType();
        if(this.routesMap.get(messageType) === null){
            this.routesMap.put(messageType, route);
        } else {
            throw new Error("The messageType " + messageType + " already exists in the routesMap");
        }

    },

    /*
     * @param {Array.<SocketRoute> | {*}} routes
     **/
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
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.SocketRoutesManager', SocketRoutesManager);
