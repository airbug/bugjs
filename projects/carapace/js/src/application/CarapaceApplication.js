//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('CarapaceApplication')

//@Require('Backbone')
//@Require('Class')
//@Require('CarapaceController')
//@Require('Obj')
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
        this.activeController = null;

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
            controller.addEventListener(CarapaceController.EventTypes.ACTIVATE_CONTROLLER,
                this.hearControllerActivateControllerEvent, this);
            this.registeredControllerSet.add(controller);
        }
    },

    /**
     * @param {ControllerRoute} controllerRoute
     */
    registerControllerRoute: function(controllerRoute) {
        if (!this.registeredControllerRouteSet.contains(controllerRoute)) {
            this.registeredControllerRouteSet.add(controllerRoute);
            controllerRoute.initialize(this.router);
        }
    },

    /**
     *
     */
    start: function() {
        var result = Backbone.history.start();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearControllerActivateControllerEvent: function(event) {
        if (this.activeController) {
            this.activeController.stop();
        }
        this.activeController = event.getData();
    }
});
