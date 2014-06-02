/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.ControllerRoute')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var RoutingRequest      = bugpack.require('carapace.RoutingRequest');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var ControllerRoute = Class.extend(EventDispatcher, {

        _name: "carapace.ControllerRoute",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} route
         * @param {CarapaceController} controller
         */
        _constructor: function(route, controller) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CarapaceRouter} router
         */
        setupRoute: function(router) {
            if (!this.initialized) {
                this.initialized = true;
                var _this = this;
                router.route(this.route, this.routeId, function() {
                    var args = ArgUtil.toArray(arguments);
                    _this.requestRouting(args);
                });
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
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
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    ControllerRoute.EventType = {
        ROUTING_REQUESTED: "ControllerRoute:RoutingRequested"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.ControllerRoute', ControllerRoute);
});
