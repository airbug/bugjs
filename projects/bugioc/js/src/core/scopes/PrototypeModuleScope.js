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

//@Export('bugioc.PrototypeModuleScope')

//@Require('Class')
//@Require('List')
//@Require('bugioc.ModuleScope')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var List            = bugpack.require('List');
    var ModuleScope     = bugpack.require('bugioc.ModuleScope');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleScope}
     */
    var PrototypeModuleScope = Class.extend(ModuleScope, {

        _name: "bugioc.PrototypeModuleScope",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         * @param {IocModule} iocModule
         */
        _constructor: function(iocContext, iocModule) {

            this._super(iocContext, iocModule);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List.<Module>}
             */
            this.generatedModuleList = new List();
        },


        //-------------------------------------------------------------------------------
        // ModuleScope Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Module}
         */
        generateModule: function() {
            var module = this.factoryModule();
            this.generatedModuleList.add(module);
            return module;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.PrototypeModuleScope', PrototypeModuleScope);
});
