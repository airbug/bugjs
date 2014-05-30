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

//@Export('bugcontroller.Controller')

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.IProcessModule')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var IProcessModule      = bugpack.require('bugioc.IProcessModule');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Controller = Class.extend(Obj, {

        _name: "bugcontroller.Controller",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ControllerManager} controllerManager
         */
        _constructor: function(controllerManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.configured                 = false;

            /**
             * @private
             * @type {ControllerManager}
             */
            this.controllerManager          = controllerManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isConfigured: function() {
            return this.configured;
        },

        /**
         * @return {ControllerManager}
         */
        getControllerManager: function() {
            return this.controllerManager;
        },


        //-------------------------------------------------------------------------------
        // IProcessModule Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        processModule: function() {
            this.controllerManager.registerController(this);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configure: function(callback) {
            if (!this.isConfigured()) {
                this.configureController(callback);
            } else {
                callback();
            }
        },

        /**
         * @param {function(Throwable=)} callback
         */
        unconfigure: function(callback) {
            if (this.isConfigured()) {
                this.unconfigureController(callback);
            } else {
                callback();
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        unconfigureController: function(callback) {
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Controller, IProcessModule);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcontroller.Controller', Controller);
});
