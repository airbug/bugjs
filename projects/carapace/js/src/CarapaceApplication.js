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

//@Export('carapace.CarapaceApplication')
//@Autoload

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('backbone.Backbone')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceController')
//@Require('carapace.ControllerRoute')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Event                   = bugpack.require('Event');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Set                     = bugpack.require('Set');
    var Backbone                = bugpack.require('backbone.Backbone');
    var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
    var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ControllerRoute         = bugpack.require('carapace.ControllerRoute');
    var RoutingRequest          = bugpack.require('carapace.RoutingRequest');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgAnnotation.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleAnnotation.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var CarapaceApplication = Class.extend(EventDispatcher, {

        _name: "carapace.CarapaceApplication",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {CarapaceRouter} router
         */
        _constructor: function(logger, router) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CarapaceController}
             */
            this.currentController              = null;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                         = logger;

            /**
             * @private
             * @type {CarapaceRouter}
             */
            this.router                         = router;

            /**
             * @private
             * @type {Set.<CarapaceController>}
             */
            this.registeredControllerSet        = new Set();

            /**
             * @private
             * @type {Set.<ControllerRoute>}
             */
            this.registeredControllerRouteSet   = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CarapaceController} controller
         */
        registerController: function(controller) {
            if (!this.registeredControllerSet.contains(controller)) {
                this.registeredControllerSet.add(controller);
            }
        },

        /**
         * @param {ControllerRoute} controllerRoute
         */
        registerControllerRoute: function(controllerRoute) {
            if (!this.registeredControllerRouteSet.contains(controllerRoute)) {
                this.registeredControllerRouteSet.add(controllerRoute);
                controllerRoute.setupRoute(this.router);
                controllerRoute.addEventListener(ControllerRoute.EventType.ROUTING_REQUESTED,
                    this.hearControllerRouteRoutingRequestedEvent, this);
            }
        },

        /**
         *
         */
        start: function(callback) {
            var result = Backbone.history.start();
            callback();
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {CarapaceController} controller
         * @param {Array<*>} routingArgs
         */
        startController: function(controller, routingArgs) {
            if (this.currentController) {
                this.currentController.stop();
            }
            this.currentController = controller;
            controller.start(routingArgs);
        },

        /**
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        acceptRoutingRequest: function(routingRequest) {
            this.logger.info("Routing request accepted!");
            var routingArgs = routingRequest.getArgs();
            var route       = routingRequest.getRoute();
            var controller  = route.getController();
            this.startController(controller, routingArgs);
        },

        /**
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        forwardRoutingRequest: function(routingRequest) {
            this.logger.info("Routing request forwarded!");
            var forwardFragment = routingRequest.getForwardFragment();
            var forwardOptions  = routingRequest.getForwardOptions();
            this.router.navigate(forwardFragment, forwardOptions);
        },

        /**
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        rejectRoutingRequest: function(routingRequest) {
            var rejectReason    = routingRequest.getRejectReason();
            var rejectData      = routingRequest.getRejectData();

            //TODO BRN: Build an annotation for adding rejection handlers to controllers

            this.logger.info("Routing request was rejected!");
            if (rejectReason === RoutingRequest.RejectReason.ERROR) {
                this.logger.error(rejectData.throwable);
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {RoutingRequest} routingRequest
         */
        processRoutingRequestResults: function(routingRequest) {
            var result  = routingRequest.getResult();
            switch (result) {
                case RoutingRequest.Result.ACCEPTED:
                    this.acceptRoutingRequest(routingRequest);
                    break;
                case RoutingRequest.Result.FORWARDED:
                    this.forwardRoutingRequest(routingRequest);
                    break;
                case RoutingRequest.Result.REJECTED:
                    this.rejectRoutingRequest(routingRequest);
                    break;
            }
        },

        /**
         * @private
         * @param {RoutingRequest} routingRequest
         */
        listenToRoutingRequest: function(routingRequest) {
            routingRequest.addEventListener(RoutingRequest.EventType.PROCESSED,
                this.hearRoutingRequestProcessedEvent, this);
            routingRequest.addEventPropagator(this);
        },

        /**
         * @private
         * @param {RoutingRequest} routingRequest
         */
        stopListeningToRoutingRequest: function(routingRequest) {
            routingRequest.removeEventListener(RoutingRequest.EventType.PROCESSED,
                this.hearRoutingRequestProcessedEvent, this);
            routingRequest.removeEventPropagator(this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearControllerRouteRoutingRequestedEvent: function(event) {
            var controllerRoute = event.getTarget();
            var routingRequest  = event.getData().routingRequest;
            var controller      = controllerRoute.getController();
            this.listenToRoutingRequest(routingRequest);
            controller.route(routingRequest);
        },

        /**
         * @private
         * @param {Event} event
         */
        hearRoutingRequestProcessedEvent: function(event) {
            var routingRequest = event.getTarget();
            this.stopListeningToRoutingRequest(routingRequest);
            this.processRoutingRequestResults(routingRequest);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(CarapaceApplication).with(
        module("carapaceApplication")
            .args([
                arg().ref("logger"),
                arg().ref("carapaceRouter")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('carapace.CarapaceApplication', CarapaceApplication);
});
