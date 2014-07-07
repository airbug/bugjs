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

//@Export('bugioc.ClassModuleFactory')

//@Require('Class')
//@Require('bugioc.Module')
//@Require('bugioc.ModuleFactory')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Module          = bugpack.require('bugioc.Module');
    var ModuleFactory   = bugpack.require('bugioc.ModuleFactory');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleFactory}
     */
    var ClassModuleFactory = Class.extend(ModuleFactory, {

        _name: "bugioc.ClassModuleFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         * @param {IocModule} iocModule
         * @param {Class} moduleClass
         */
        _constructor: function(iocContext, iocModule, moduleClass) {

            this._super(iocContext, iocModule);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Class}
             */
            this.moduleClass = moduleClass;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Class}
         */
        getModuleClass: function() {
            return this.moduleClass;
        },


        //-------------------------------------------------------------------------------
        // ModuleFactory Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Module}
         */
        factoryModule: function() {
            var moduleArgs      = this.buildModuleArgs();
            return new Module(this.getIocModule(), this.moduleClass.newInstance(moduleArgs));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ClassModuleFactory', ClassModuleFactory);
});
