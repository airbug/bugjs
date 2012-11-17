//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Carapace')

//@Require('Annotate')
//@Require('Class')
//@Require('CarapaceController')
//@Require('CarapaceRouter')
//@Require('ControllerRoute')
//@Require('List')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Carapace = Class.extend(Obj, {

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
        this.router = new CarapaceRouter();

        /**
         * @private
         * @type {List<CarapaceController>}
         */
        this.registeredControllerList = new List();

        /**
         * @private
         * @type {List<ControllerRoute>}
         */
        this.registeredControllerRouteList = new List();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param controllerClass
     * @param annotateRouteList
     */
    registerController: function(controllerClass, annotateRouteList) {
        var controller = new controllerClass(this.router);
        controller.addEventListener(CarapaceController.EventTypes.ACTIVATE_CONTROLLER, this.hearControllerActivateControllerEvent, this);
        this.registeredControllerList.add(controller);
        var _this = this;
        annotateRouteList.forEach(function(annotateRoute) {
            _this.registerControllerRoute(annotateRoute.getRoute(), controller);
        });
    },

    /**
     * @private
     * @param {string} route
     * @param {CarapaceController} controller
     */
    registerControllerRoute: function(route, controller) {
        var controllerRoute = new ControllerRoute(route, controller);
        this.registeredControllerRouteList.add(controllerRoute);

        //TODO BRN (QUESTION): Is this the right place to initialize the route? Should this be broken in to some bootstrap?

        controllerRoute.initialize(this.router);
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

//-------------------------------------------------------------------------------
// Private Static Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {Carapace}
 */
Carapace.instance = null;


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

Carapace.instance = new Carapace();
Proxy.proxy(Carapace, Carapace.instance, [
    "registerController"
]);
Annotate.registerAnnotationProcessor('Controller', function(annotation) {
    Carapace.registerController(annotation.getReference(), annotation.getParamList());
});
