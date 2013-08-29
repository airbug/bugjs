//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('carapace')

//@Export('ControllerScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var ControllerRoute     = bugpack.require('carapace.ControllerRoute');


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
        var _this                   = this;
        var bugmeta                 = BugMeta.context();
        var controllerAnnotations   = bugmeta.getAnnotationsByType("Controller");
        if (controllerAnnotations) {
            controllerAnnotations.forEach(function(annotation) {
                var controllerClass = annotation.getReference();
                var controllerRoute = annotation.getRoute();
                _this.createController(controllerClass, controllerRoute);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Class} controllerClass
     * @param {string} controllerRoute
     */
    createController: function(controllerClass, controllerRoute) {
        var _this = this;
        if (!this.controllerClassToControllerMap.containsKey(controllerClass)) {
            var controller = new controllerClass();
            this.application.registerController(controller);
            this.controllerClassToControllerMap.put(controllerClass, controller);
            _this.application.registerControllerRoute(new ControllerRoute(controllerRoute, controller));
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('carapace.ControllerScan', ControllerScan);
