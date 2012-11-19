//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ControllerScan')

//@Require('Annotate')
//@require('Carapace')
//@Require('Class')
//@Require('ControllerRoute')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ControllerScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(application) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CarapaceApplication}
         */
        this.application = application;

        /**
         * @private
         * @type {Map<Class, CarapaceController>}
         */
        this.controllerClassToControllerMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scan: function() {
        var _this = this;
        var controllerAnnotations = Annotate.getAnnotationsByType("Controller");
        if (controllerAnnotations) {
            controllerAnnotations.forEach(function(annotation) {
                var controllerClass = annotation.getReference();
                var annotateRouteList = annotation.getParamList();
                _this.createController(controllerClass, annotateRouteList);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Class} controllerClass
     * @param {List<AnnotateRoute>} annotateRouteList
     */
    createController: function(controllerClass, annotateRouteList) {
        var _this = this;
        if (!this.controllerClassToControllerMap.containsKey(controllerClass)) {
            var controller = new controllerClass();
            this.application.registerController(controller);
            annotateRouteList.forEach(function(annotateRoute) {
                var route = annotateRoute.getRoute();
                var controllerRoute = new ControllerRoute(route, controller);
                _this.application.registerControllerRoute(controllerRoute);
            });
            this.controllerClassToControllerMap.put(controllerClass, controller);
        }
    }
});
