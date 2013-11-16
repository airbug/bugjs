//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('BugCallRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
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
     */
    _constructor: function(){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<}
         */
        this.routesMap                      = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    getRoutes: function() {
        return this.routesMap.getValueArray();
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
            bugCallRoute.fire(request, responder, callback);
        } else {
            console.log("Error Bugroute", requestType, "does not exist");
            callback(new Error("Bugroute '" + requestType + "' does not exist"));
        }
    }
});

Class.implement(BugCallRouter, IProcessRequest);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.BugCallRouter', BugCallRouter);
