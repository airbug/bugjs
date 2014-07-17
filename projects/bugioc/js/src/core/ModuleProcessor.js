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

//@Export('bugioc.ModuleProcessor')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('bugioc.IModuleProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug         = bugpack.require('Bug');
    var Class       = bugpack.require('Class');
    var Obj       = bugpack.require('Obj');
    var IModuleProcessor   = bugpack.require('bugioc.IModuleProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @class
     * @extends {Obj}
     * @implements {IModuleProcessor}
     */
    var ModuleProcessor = Class.extend(Obj, {

        _name: "bugioc.ModuleProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------


        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------
        // IModuleProcessor Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        deprocessModule: function(module, callback) {
            this.doDeprocessModule(module, callback);
        },

        /**
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        processModule: function(module, callback) {
            this.doProcessModule(module, callback);
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        doDeprocessModule: function(module, callback) {
            throw new Bug("AbstractMethodNotImplemented", {}, "Must implement the doDeprocessModule method");
        },

        /**
         * @abstract
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        doProcessModule: function(module, callback) {
            throw new Bug("AbstractMethodNotImplemented", {}, "Must implement the doProcessModule method");
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ModuleProcessor, IModuleProcessor);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleProcessor', ModuleProcessor);
});
