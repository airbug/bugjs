//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('BugCallRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugroutes.BugCallRoute')
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
var BugCallRoute        = bugpack.require('bugroutes.BugCallRoute');
var SocketIoManager     = bugpack.require('socketio:server.SocketIoManager');
var SocketIoConnection  = bugpack.require('socketio:socket.SocketIoConnection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallRouter = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {bugCallServer} bugCallServer
     */
    _constructor: function(bugCallServer){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer = bugCallServer;

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

        this.bugCallServer.on(BugCallServer.EventTypes.REQUEST, this.handleConnectionRequest, this);

        callback();
    },

    /**
     * @param {BugCallRoute} route
     */
    add: function(route){
        var requestType = route.getRequestType();
        if(this.routesMap.get(requestType) === null){
            this.routesMap.put(requestType, route);
        } else {
            throw new Error("The bugCallRoute" + requestType + " already exists in the routesMap");
        }
    },

    /**
     * @param {Array.<BugCallRoute> | {*}} routes
     */
    addAll: function(routes){
        var _this = this;
        if(TypeUtil.isArray(routes)){
            routes.forEach(function(route){
                _this.add(route);
            });
        } else if(TypeUtil.isObject(routes)){
            for(var requestType in routes){
                var listener = routes[requestType];
                if(TypeUtil.isFunction(listener)){
                    _this.add(new BugCallRoute(requestType, listener))
                }
            }
        } else {
            var routes = Array.prototype.slice.call(arguments);
            this.addAll(routes);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listener
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleConnectionRequest: function(event) {
        var request         = event.getData().request;
        var requestType     = request.getType();
        var responder       = event.getData().responder;
        var bugCallRoute    = _this.routesMap.get(requestType);
        if(bugCallRoute) bugCallRoute.fire(request, responder);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.BugCallRouter', BugCallRouter);
