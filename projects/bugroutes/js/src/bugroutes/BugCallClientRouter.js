//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('BugCallClientRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugcall.BugCallClient')
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
var BugCallClient       = bugpack.require('bugcall.BugCallClient');
var BugCallRoute        = bugpack.require('bugroutes.BugCallRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallClientRouter = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {bugCallClient} bugCallClient
     */
    _constructor: function(bugCallClient){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallClient}
         */
        this.bugCallClient  = bugCallClient;

        /**
         * @private
         * @type {Map.<}
         */
        this.routesMap      = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    initialize: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        this.bugCallClient.on(BugCallClient.EventTypes.REQUEST, this.handleConnectionRequest, this);

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

    getBugCallClient: function(){
        return this.bugCallClient;
    },

    /**
     @return {BugCallServer}
     */
    getBugCallServer: function() {
        return this.bugCallServer;
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
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

bugpack.export('bugroutes.BugCallClientRouter', BugCallClientRouter);
