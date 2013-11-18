//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroute:bugcall')

//@Export('BugCallRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugcall.IProcessRequest')
//@Require('bugroute:bugcall.BugCallRoute')


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
var BugCallRoute        = bugpack.require('bugroute:bugcall.BugCallRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 * @implements {IProcessRequest}
 */
var BugCallRouter = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function(){

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, ICallRoute>}
         */
        this.routesMap      = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Array.<ICallRoute>}
     */
    getRoutes: function() {
        return this.routesMap.getValueArray();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ICallRoute} route
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
     * @param {(Array.<ICallRoute> | {})} routes
     */
    addAll: function(routes) {
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
    // IProcessRequest Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)} callback
     */
    processRequest: function(request, responder, callback) {
        var requestType     = request.getType();
        var bugCallRoute    = this.routesMap.get(requestType);
        if (bugCallRoute) {
            bugCallRoute.route(request, responder, callback);
        } else {
            console.log("Error route '", requestType, "' does not exist");
            callback(new Error("Route '" + requestType + "' does not exist"));
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(BugCallRouter, IProcessRequest);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroute:bugcall.BugCallRouter', BugCallRouter);
