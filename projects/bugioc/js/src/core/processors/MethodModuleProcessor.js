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

//@Export('bugioc.MethodModuleProcessor')

//@Require('Class')
//@Require('bugioc.ModuleProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var ModuleProcessor   = bugpack.require('bugioc.ModuleProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleProcessor}
     */
    var MethodModuleProcessor = Class.extend(ModuleProcessor, {

        _name: "bugioc.MethodModuleProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(*)} method
         * @param {Object=} context
         */
        _constructor: function(method, context) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.context    = context;

            /**
             * @private
             * @type {function(*)}
             */
            this.method     = method;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getContext: function() {
            return this.context;
        },

        /**
         * @return {function(*)}
         */
        getMethod: function() {
            return this.method;
        },


        //-------------------------------------------------------------------------------
        // ModuleProcessor Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} module
         */
        doProcessModule: function(module) {
           this.method.call(this.context, module);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.MethodModuleProcessor', MethodModuleProcessor);
});
