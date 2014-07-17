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
         * @param {?function(Module)} processMethod
         * @param {?function(Module)} deprocessMethod
         * @param {Object=} context
         */
        _constructor: function(processMethod, deprocessMethod, context) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.context            = context;

            /**
             * @private
             * @type {function(Module)}
             */
            this.deprocessMethod    = deprocessMethod;

            /**
             * @private
             * @type {function(Module)}
             */
            this.processMethod      = processMethod;
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
         * @return {function(Module)}
         */
        getDeprocessMethod: function() {
            return this.deprocessMethod;
        },

        /**
         * @return {function(Module)}
         */
        getProcessMethod: function() {
            return this.processMethod;
        },


        //-------------------------------------------------------------------------------
        // ModuleProcessor Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        doDeprocessModule: function(module, callback) {
            if (this.deprocessMethod) {
                this.deprocessMethod.call(this.context, module.getInstance(), callback);
            } else {
                callback();
            }
        },

        /**
         * @param {Module} module
         * @param {function(Throwable=)} callback
         */
        doProcessModule: function(module, callback) {
            if (this.processMethod) {
                this.processMethod.call(this.context, module.getInstance(), callback);
            } else {
                callback();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.MethodModuleProcessor', MethodModuleProcessor);
});
