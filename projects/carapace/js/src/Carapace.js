//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Carapace')

//@Require('Annotate')
//@Require('Backbone')
//@Require('Class')
//@Require('CarapaceController')
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
         *
         * @type {*}
         */
        this.activeController = null;

        /**
         * @private
         * @type {Backbone.Router}
         */
        this.backboneRouter = new Backbone.Router();

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
        var controller = new controllerClass(this.backboneRouter);
        controller.addEventListener(CarapaceController.EventTypes.ACTIVATE_CONTROLLER, this.hearControllerActivateControllerEvent, this);
        this.registeredControllerList.add(controller);
        var _this = this;
        annotateRouteList.forEach(function(annotateRoute) {
            _this.registerControllerRoute(annotateRoute.getRoute(), controller, annotateRoute.getMethod());
        });
    },

    /**
     * @private
     * @param {string} route
     * @param {CarapaceController} controller
     * @param {function()} controllerMethod
     */
    registerControllerRoute: function(route, controller, controllerMethod) {
        var controllerRoute = new ControllerRoute(route, controller, controllerMethod);
        this.registeredControllerRouteList.add(controllerRoute);

        //TODO BRN (QUESTION): Is this the right place to initialize the route? Should this be broken in to some bootstrap?

        controllerRoute.initialize(this.backboneRouter);
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
            this.activeController.deactivate();
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
