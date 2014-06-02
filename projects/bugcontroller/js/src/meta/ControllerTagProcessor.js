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

//@Export('bugcontroller.ControllerTagProcessor')

//@Require('Class')
//@Require('Set')
//@Require('bugcontroller.ControllerModuleFactory');
//@Require('bugioc.ModuleTagProcessor')


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
    var ModuleTagProcessor       = bugpack.require('bugioc.ModuleTagProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleTagProcessor}
     */
    var ControllerTagProcessor = Class.extend(ModuleTagProcessor, {

        _name: "bugcontroller.ControllerTagProcessor",


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
             * @type {Set.<ControllerTag>}
             */
            this.processedControllerTagSet   = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {ControllerTag} controllerTag
         */
        process: function(controllerTag) {
            this.processControllerTag(controllerTag);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ControllerTag} controllerTag
         */
        processControllerTag: function(controllerTag) {
            if (!this.processedControllerTagSet.contains(controllerTag)) {
                var controllerConstructor       = controllerTag.getTagReference();
                var controllerClass             = controllerConstructor.getClass();
                var iocModule                   = this.factoryIocModule(controllerTag);
                var factory                     = new ControllerModuleFactory(this.getIocContext(), iocModule, controllerClass);
                iocModule.setModuleFactory(factory);
                this.getIocContext().registerIocModule(iocModule);
                this.processedControllerTagSet.add(controllerTag);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcontroller.ControllerTagProcessor', ControllerTagProcessor);
});
