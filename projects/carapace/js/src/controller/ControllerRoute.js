//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('ControllerRoute')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Event =             bugpack.require('Event');
var EventDispatcher =   bugpack.require('EventDispatcher');
var RoutingRequest =    bugpack.require('carapace.RoutingRequest');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ControllerRoute = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(route, controller) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CarapaceController}
         */
        this.controller = controller;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {string}
         */
        this.route = route;

        /**
         * @private
         * @type {string}
         */
        this.routeId = "ControllerRouter" + this.getInternalId();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CarapaceController}
     */
    getController: function() {
        return this.controller;
    },

    /**
     * @return {String}
     */
    getRoute: function() {
        return this.route;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CarapaceRouter} router
     */
    setupRoute: function(router) {
        if (!this.initialized) {
            this.initialized = true;
            var _this = this;
            router.route(this.route, this.routeId, function() {
                var args = Array.prototype.slice.call(arguments, 0);
                _this.requestRouting(args);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} routingArgs
     */
    requestRouting: function(routingArgs) {
        var routingRequest = new RoutingRequest(this, routingArgs);
        this.dispatchEvent(new Event(ControllerRoute.EventType.ROUTING_REQUESTED, {
            routingRequest: routingRequest
        }));
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
ControllerRoute.EventType = {
    ROUTING_REQUESTED: "ControllerRoute:RoutingRequested"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.ControllerRoute', ControllerRoute);
