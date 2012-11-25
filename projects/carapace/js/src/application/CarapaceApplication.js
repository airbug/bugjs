//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceApplication')

//@Require('Backbone')
//@Require('Class')
//@Require('CarapaceController')
//@Require('ControllerRoute')
//@Require('Obj')
//@Require('RoutingRequest')
//@Require('Set')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CarapaceApplication = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CarapaceController}
         */
        this.currentController = null;

        /**
         * @private
         * @type {CarapaceRouter}
         */
        this.router = router;

        /**
         * @private
         * @type {Set<CarapaceController>}
         */
        this.registeredControllerSet = new Set();

        /**
         * @private
         * @type {Set<ControllerRoute>}
         */
        this.registeredControllerRouteSet = new Set();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
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
    start: function() {
        var result = Backbone.history.start();
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
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
        //TEST
        console.log("Routing request accepted!");

        var routingArgs = routingRequest.getArgs();
        var route = routingRequest.getRoute();
        var controller = route.getController();
        this.startController(controller, routingArgs);
    },

    /**
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    forwardRoutingRequest: function(routingRequest) {
        //TEST
        console.log("Routing request forwarded!");

        var forwardFragment = routingRequest.getForwardFragment();
        var forwardOptions = routingRequest.getForwardOptions();
        this.router.navigate(forwardFragment, forwardOptions);
    },

    /**
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    rejectRoutingRequest: function(routingRequest) {
        //TEST
        console.log("Routing request rejected!");

        var rejectedReason = routingRequest.getRejectedReason();

    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {RoutingRequest} routingRequest
     */
    processRoutingRequestResults: function(routingRequest) {
        switch (routingRequest.getResult()) {
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
    },

    /**
     * @private
     * @param {RoutingRequest} routingRequest
     */
    stopListeningToRoutingRequest: function(routingRequest) {
        routingRequest.removeEventListener(RoutingRequest.EventType.PROCESSED,
            this.hearRoutingRequestProcessedEvent, this);
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
        var routingRequest = event.getData().routingRequest;
        var controller = controllerRoute.getController();
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
