//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('ControllerRoute')

//@Require('Class')
//@Require('EventDispatcher')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var EventDispatcher =   bugpack.require('EventDispatcher');


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
                _this.requestRouting(arguments);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routingArgs
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
    ROUTING_REQUESTED: "ControlerRoute:RoutingRequested"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.ControllerRoute', ControllerRoute);
