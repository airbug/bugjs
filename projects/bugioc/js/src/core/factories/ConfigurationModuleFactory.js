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

//@Export('bugioc.ConfigurationModuleFactory')

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
    var ConfigurationModuleFactory = Class.extend(ModuleFactory, {

        _name: "bugioc.ConfigurationModuleFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         * @param {IocModule} iocModule
         * @param {IocModule} configurationIocModule
         */
        _constructor: function(iocContext, iocModule, configurationIocModule) {

            this._super(iocContext, iocModule);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocModule}
             */
            this.configurationIocModule = configurationIocModule;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocModule}
         */
        getConfigurationIocModule: function() {
            return this.configurationIocModule;
        },


        //-------------------------------------------------------------------------------
        // ModuleFactory Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Module}
         */
        factoryModule: function() {
            var configuration   = this.getIocContext().generateModuleByName(this.configurationIocModule.getName()).getInstance();
            var moduleMethod    = configuration[this.getIocModule().getName()];
            if (!moduleMethod) {
                throw new Error("Cannot find module method in configuration that matches '" + this.getIocModule().getName() + "'");
            }
            var moduleArgs      = this.buildModuleArgs();
            return new Module(this.getIocModule(), moduleMethod.apply(configuration, moduleArgs));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ConfigurationModuleFactory', ConfigurationModuleFactory);
});
