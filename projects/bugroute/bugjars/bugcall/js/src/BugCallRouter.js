//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroute:bugcall')

//@Export('BugCallRouter')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugcall.IProcessRequest')
//@Require('bugroute:bugcall.BugCallRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
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
        this.routeMap      = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Array.<ICallRoute>}
     */
    getRouteArray: function() {
        return this.routeMap.getValueArray();
    },

    /**
     * @returns {Map.<string, ICallRoute>}
     */
    getRouteMap: function() {
        return this.routeMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ICallRoute} route
     */
    add: function(route) {
        var requestType = route.getRequestType();
        if (!this.routeMap.containsKey(requestType)) {
            this.routeMap.put(requestType, route);
        } else {
            throw new Error("The bugCallRoute '" + requestType + "' already exists in the routeMap");
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
            Obj.forIn(routes, function(requestType, listener) {
                if (TypeUtil.isFunction(listener)) {
                    _this.add(new BugCallRoute(requestType, listener));
                }
            });
        } else {
            var args = ArgUtil.toArray(arguments);
            this.addAll(args);
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
        var bugCallRoute    = this.routeMap.get(requestType);
        if (bugCallRoute) {
            bugCallRoute.route(request, responder, callback);
        } else {
            callback(new Exception("NoRouteFound", {}, "Route '" + requestType + "' does not exist"));
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
