//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('BugCallRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugcall.BugCallRequestEvent')
//@Require('bugcall.IProcessRequest')
//@Require('bugroutes.BugCallRoute')


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
var BugCallRequestEvent = bugpack.require('bugcall.BugCallRequestEvent');
var IProcessRequest     = bugpack.require('bugcall.IProcessRequest');
var BugCallRoute        = bugpack.require('bugroutes.BugCallRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallRouter = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {?EventDispatcher} bugCallRequestEventDispatcher
     */
    _constructor: function(bugCallRequestEventDispatcher){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {EventDispatcher}
         */
        this.bugCallRequestEventDispatcher  = bugCallRequestEventDispatcher;

        /**
         * @private
         * @type {Map.<}
         */
        this.routesMap                      = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    initialize: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};
        if(this.bugCallRequestEventDispatcher) this.bugCallRequestEventDispatcher.on(BugCallRequestEvent.REQUEST, this.handleRequest, this);
        callback();
    },

    /**
     * @param {BugCallRoute} route
     */
    add: function(route) {
        var requestType = route.getRequestType();
        if (!this.routesMap.containsKey(requestType)) {
            this.routesMap.put(requestType, route);
        } else {
            throw new Error("The bugCallRoute '" + requestType + "' already exists in the routesMap");
        }
    },

    /**
     * @param {(Array.<BugCallRoute> | {*})} routes
     */
    addAll: function(routes){
        var _this = this;
        if (TypeUtil.isArray(routes)) {
            routes.forEach(function(route) {
                _this.add(route);
            });
        } else if (TypeUtil.isObject(routes)) {
            for (var requestType in routes) {
                var listener = routes[requestType];
                if (TypeUtil.isFunction(listener)) {
                    _this.add(new BugCallRoute(requestType, listener));
                }
            }
        } else {
            var routes = Array.prototype.slice.call(arguments);
            this.addAll(routes);
        }
    },

    //-------------------------------------------------------------------------------
    // Getters
    //-------------------------------------------------------------------------------

    /**
     * @return {EventDispatcher}
     */
    getBugCallRequestEventDispatcher: function() {
        return this.bugCallRequestEventDispatcher;
    },

    //-------------------------------------------------------------------------------
    // IProcess Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)}  callback
     */
    processRequest: function(request, responder, callback) {
        console.log("Inside BugCallRouter#processRequest");
        var requestType     = request.getType();
        var bugCallRoute    = this.routesMap.get(requestType);
        console.log("requestType:", requestType);
        if(bugCallRoute) {
            bugCallRoute.fire(request, responder);
            callback();
        } else {
            callback(new Error("Bugroute '" + requestType + "' does not exist"));
        }
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleRequest: function(event) {
        console.log("Inside BugCallRouter#handleRequest");
        var data            = event.getData();
        var request         = data.request;
        var requestType     = request.getType();
        var responder       = data.responder;
        var bugCallRoute    = this.routesMap.get(requestType);
        console.log("requestType:", requestType);
        if(bugCallRoute) bugCallRoute.fire(request, responder);
    }
});

Class.implement(BugCallRouter, IProcessRequest);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.BugCallRouter', BugCallRouter);
