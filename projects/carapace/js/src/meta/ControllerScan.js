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

//@Export('carapace.ControllerScan')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerRoute')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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

    /**
     * @class
     * @extends {Obj}
     */
    var ControllerScan = Class.extend(Obj, {

        _name: "carapace.ControllerScan",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CarapaceApplication} application
         */
        _constructor: function(application) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
                    var controllerConstructor   = annotation.getAnnotationReference();
                    var controllerClass         = controllerConstructor.getClass();
                    var controllerRoute         = annotation.getRoute();
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
                var controllerConstructor   = controllerClass.getConstructor();
                var controller              = new controllerConstructor();
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
});
