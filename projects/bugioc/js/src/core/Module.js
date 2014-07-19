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

//@Export('bugioc.Module')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugioc.IConfiguringModule')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.IPreConfiguringModule')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var Obj     = bugpack.require('Obj');
    var IConfiguringModule      = bugpack.require('bugioc.IConfiguringModule');
    var IInitializingModule      = bugpack.require('bugioc.IInitializingModule');
    var IPreConfiguringModule   = bugpack.require('bugioc.IPreConfiguringModule');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Module = Class.extend(Obj, {

        _name: "bugioc.Module",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocModule} iocModule
         * @param {*} instance
         */
        _constructor: function(iocModule, instance) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.instance       = instance;

            /**
             * @private
             * @type {IocModule}
             */
            this.iocModule      = iocModule;

            /**
             * @private
             * @type {Module.State|string}
             */
            this.moduleState    = Module.State.GENERATED;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getInstance: function() {
            return this.instance;
        },

        /**
         * @return {IocModule}
         */
        getIocModule: function() {
            return this.iocModule;
        },

        /**
         * @return {Module.State|string}
         */
        getModuleState: function() {
            return this.moduleState;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isConfigured: function() {
            return (this.moduleState === Module.State.CONFIGURED
                || this.moduleState === Module.State.INITIALIZED);
        },

        /**
         * @return {boolean}
         */
        isInitialized: function() {
            return this.moduleState === Module.State.INITIALIZED;
        },

        /**
         * @return {boolean}
         */
        isPreConfigured: function() {
            return (this.moduleState === Module.State.PRE_CONFIGURED
                || this.moduleState === Module.State.CONFIGURED
                || this.moduleState === Module.State.INITIALIZED);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        configure: function() {
            if (!this.isConfigured()) {
                this.moduleState = Module.State.CONFIGURED;
                this.configureModule();
            }
        },

        /**
         * @param {function(Throwable=)} callback
         */
        deinitialize: function(callback) {
            var _this = this;
            if (this.isInitialized()) {
                this.deinitializeModule(function(throwable) {
                    if (!throwable) {
                        _this.moduleState = Module.State.CONFIGURED;
                    }
                    callback(throwable);
                });
            } else {
                callback(new Exception("IllegalState", {}, "Module must be in initialized state before called deinitialize"));
            }
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initialize: function(callback) {
            var _this = this;
            if (!this.isInitialized()) {
                this.initializeModule(function(throwable) {
                    if (!throwable) {
                        _this.moduleState = Module.State.INITIALIZED;
                    }
                    callback(throwable);
                });
            } else {
                callback(new Exception("IllegalState", {}, "Module is already initialized"));
            }
        },

        /**
         *
         */
        preConfigure: function() {
            if (!this.isPreConfigured()) {
                this.moduleState = Module.State.PRE_CONFIGURED;
                this.preConfigureModule();
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        configureModule: function() {
            if (Class.doesImplement(this.instance, IConfiguringModule)) {
                this.instance.configureModule();
            }
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            if (Class.doesImplement(this.instance, IInitializingModule)) {
                this.instance.deinitializeModule(callback);
            } else {
                callback();
            }
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            if (Class.doesImplement(this.instance, IInitializingModule)) {
                this.instance.initializeModule(callback);
            } else {
                callback();
            }
        },

        /**
         * @private
         */
        preConfigureModule: function() {
            if (Class.doesImplement(this.instance, IPreConfiguringModule)) {
                this.instance.preConfigureModule();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    Module.State = {
        CONFIGURED: "Module:State:Configured",
        GENERATED: "Module:State:Generated",
        INITIALIZED: "Module:State:Initialized",
        PRE_CONFIGURED: "Module:State:PreConfigured"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.Module', Module);
});
