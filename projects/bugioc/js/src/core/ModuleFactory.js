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

//@Export('bugioc.ModuleFactory')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug     = bugpack.require('Bug');
    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ModuleFactory = Class.extend(Obj, {

        _name: "bugioc.ModuleFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         * @param {IocModule} iocModule
         */
        _constructor: function(iocContext, iocModule) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext     = iocContext;

            /**
             * @private
             * @type {IocModule}
             */
            this.iocModule      = iocModule;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocContext}
         */
        getIocContext: function() {
            return this.iocContext;
        },

        /**
         * @return {IocModule}
         */
        getIocModule: function() {
            return this.iocModule;
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @return {Module}
         */
        factoryModule: function() {
            throw new Bug("AbstractMethodNotImplemented", {}, "Must implement abstract method 'factoryModule' in " + this.getClass().getName());
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Array.<*>}
         */
        buildModuleArgs: function() {
            var _this           = this;
            var moduleArgs      = [];
            var iocArgList      = this.iocModule.getIocArgList();
            iocArgList.forEach(function(iocArg) {
                if (iocArg.getRef()) {
                    var refModule = _this.iocContext.generateModuleByName(iocArg.getRef()).getInstance();
                    moduleArgs.push(refModule);
                } else {
                    moduleArgs.push(iocArg.getValue());
                }
            });
            return moduleArgs;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleFactory', ModuleFactory);
});
