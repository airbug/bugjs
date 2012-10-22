//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Controller')

//@Require('Annotate')
//@Require('Backbone')
//@Require('Class')
//@Require('ControllerRoute')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Controller = Class.extend(Obj, {

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
         * @type {boolean}
         */
        this.activated = false;

        /**
         * @private
         * @type {List<Model>}
         */
        this.modelList = new List();

        /**
         * @private
         * @type {Backbone.Router}
         */
        this.router = router;

        /**
         * @private
         * @type {List<View>}
         */
        this.viewList = new List();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(...*)} method
     * @param {Array<*>} args
     */
    processRoute: function(method, args) {
        this.activate();
        method.apply(this, args);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activate: function() {
        this.activated = true;
    },

    /**
     * @private
     * @param {Model} model
     */
    addModel: function(model) {
        this.modelList.add(model);
    },

    /**
     * @private
     * @param {View} view
     */
    addView: function(view) {
        this.viewList.add(view);
        view.create();
        $('body').append(view.el);
    },

    /**
     * @protected
     */
    deactivate: function() {
        this.activated = false;
        this.viewList.forEach(function(view) {
            view.destroy();
        });
        this.viewList.clear();
    },

    /**
     * @protected
     * @param {string} fragment
     * @param {Object} options
     */
    navigate: function(fragment, options) {
        this.deactivate();
        this.router.navigate(fragment, options);
    }
});


//-------------------------------------------------------------------------------
// Private Static Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {List<Controller>}
 */
Controller.registeredControllerList = new List();

/**
 * @private
 * @type {List<ControllerRoute>}
 */
Controller.registeredControllerRouteList = new List();

/**
 * @private
 * @type {Backbone.Router}
 */
Controller.backboneRouter = new Backbone.Router();


//-------------------------------------------------------------------------------
// Private Static Methods
//-------------------------------------------------------------------------------

/**
 * @private
 * @param controllerClass
 * @param annotateRouteList
 */
Controller.registerController = function(controllerClass, annotateRouteList) {
    var controller = new controllerClass(Controller.backboneRouter);
    Controller.registeredControllerList.add(controller);
    annotateRouteList.forEach(function(annotateRoute) {
        Controller.registerControllerRoute(annotateRoute.getRoute(), controller, annotateRoute.getMethod());
    });
};

/**
 * @private
 * @param {string} route
 * @param {Controller} controller
 * @param {function()} controllerMethod
 */
Controller.registerControllerRoute = function(route, controller, controllerMethod) {
    var controllerRoute = new ControllerRoute(route, controller, controllerMethod);
    Controller.registeredControllerRouteList.add(controllerRoute);

    //TODO BRN (QUESTION): Is this the right place to initialize the route? Should this be broken in to some bootstrap?

    controllerRoute.initialize(Controller.backboneRouter);
};


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

Annotate.registerAnnotationProcessor('Controller', function(annotation) {
    Controller.registerController(annotation.getReference(), annotation.getParamList());
});
