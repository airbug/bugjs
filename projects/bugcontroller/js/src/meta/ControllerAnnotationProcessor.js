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

//@Export('bugcontroller.ControllerAnnotationProcessor')

//@Require('Class')
//@Require('Set')
//@Require('bugcontroller.ControllerModuleFactory');
//@Require('bugioc.ModuleAnnotationProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Set                             = bugpack.require('Set');
    var ControllerModuleFactory         = bugpack.require('bugcontroller.ControllerModuleFactory');
    var ModuleAnnotationProcessor       = bugpack.require('bugioc.ModuleAnnotationProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleAnnotationProcessor}
     */
    var ControllerAnnotationProcessor = Class.extend(ModuleAnnotationProcessor, {

        _name: "bugcontroller.ControllerAnnotationProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         */
        _constructor: function(iocContext) {

            this._super(iocContext);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<ControllerAnnotation>}
             */
            this.processedControllerAnnotationSet   = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {ControllerAnnotation} controllerAnnotation
         */
        process: function(controllerAnnotation) {
            this.processControllerAnnotation(controllerAnnotation);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ControllerAnnotation} controllerAnnotation
         */
        processControllerAnnotation: function(controllerAnnotation) {
            if (!this.processedControllerAnnotationSet.contains(controllerAnnotation)) {
                var controllerConstructor       = controllerAnnotation.getAnnotationReference();
                var controllerClass             = controllerConstructor.getClass();
                var iocModule                   = this.factoryIocModule(controllerAnnotation);
                var factory                     = new ControllerModuleFactory(this.getIocContext(), iocModule, controllerClass);
                iocModule.setModuleFactory(factory);
                this.getIocContext().registerIocModule(iocModule);
                this.processedControllerAnnotationSet.add(controllerAnnotation);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcontroller.ControllerAnnotationProcessor', ControllerAnnotationProcessor);
});
