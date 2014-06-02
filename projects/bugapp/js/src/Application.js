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

//@Export('bugapp.Application')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('bugioc.ConfigurationTagProcessor')
//@Require('bugioc.ConfigurationTagScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleTagProcessor')
//@Require('bugioc.ModuleTagScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Event                       = bugpack.require('Event');
    var EventDispatcher             = bugpack.require('EventDispatcher');
    var ConfigurationTagProcessor   = bugpack.require('bugioc.ConfigurationTagProcessor');
    var ConfigurationTagScan        = bugpack.require('bugioc.ConfigurationTagScan');
    var IocContext                  = bugpack.require('bugioc.IocContext');
    var ModuleTagProcessor          = bugpack.require('bugioc.ModuleTagProcessor');
    var ModuleTagScan               = bugpack.require('bugioc.ModuleTagScan');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var Application = Class.extend(EventDispatcher, {

        _name: "bugapp.Application",


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

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext         = new IocContext();

            /**
             * @private
             * @type {ConfigurationTagScan}
             */
            this.configurationTagScan  = new ConfigurationTagScan(BugMeta.context(), new ConfigurationTagProcessor(this.iocContext));

            /**
             * @private
             * @type {ModuleTagScan}
             */
            this.moduleTagScan         = new ModuleTagScan(BugMeta.context(), new ModuleTagProcessor(this.iocContext));

            /**
             * @private
             * @type {string}
             */
            this.state              = Application.States.STOPPED;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ConfigurationTagScan}
         */
        getConfigurationTagScan: function() {
            return this.configurationTagScan;
        },

        /**
         * @return {IocContext}
         */
        getIocContext: function() {
            return this.iocContext;
        },

        /**
         * @return {ModuleTagScan}
         */
        getModuleTagScan: function() {
            return this.moduleTagScan;
        },

        /**
         * @return {string}
         */
        getState: function() {
            return this.state;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isStarted: function() {
            return this.state === Application.States.STARTED;
        },

        /**
         * @return {boolean}
         */
        isStarting: function() {
            return this.state === Application.States.STARTING;
        },

        /**
         * @return {boolean}
         */
        isStopped: function() {
            return this.state === Application.States.STOPPED;
        },

        /**
         * @return {boolean}
         */
        isStopping: function() {
            return this.state === Application.States.STOPPING;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        start: function() {
            if (this.isStopped()) {
                this.startApplication();
            }
        },

        /**
         *
         */
        stop: function() {
            if (this.isStarted()) {
                this.stopApplication();
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        initializeApplication: function() {
            var _this = this;
            this.iocContext.initialize(function(throwable) {
                if (!throwable) {
                    _this.state = Application.States.STARTED;
                    _this.dispatchStarted();
                } else {
                    _this.dispatchError(throwable);
                }
            });
        },

        /**
         * @protected
         */
        preProcessApplication: function() {

        },

        /**
         * @protected
         */
        processApplication: function() {
            this.iocContext.process();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Throwable} throwable
         */
        dispatchError: function(throwable) {
            this.dispatchEvent(new Event(Application.EventTypes.ERROR, {
                error: throwable
            }));
        },

        /**
         * @private
         */
        dispatchStarted: function() {
            this.dispatchEvent(new Event(Application.EventTypes.STARTED));
        },

        /**
         * @private
         */
        dispatchStopped: function() {
            this.dispatchEvent(new Event(Application.EventTypes.STOPPED));
        },

        /**
         * @private
         */
        startApplication: function() {
            this.state  = Application.States.STARTING;
            this.preProcessApplication();
            this.processApplication();
            this.initializeApplication();
        },

        /**
         * @private
         */
        stopApplication: function() {
            var _this   = this;
            this.state  = Application.States.STOPPING;
            this.iocContext.deinitialize(function(throwable) {
                if (!throwable) {
                    _this.state = Application.States.STOPPED;
                    _this.dispatchStopped();
                } else {
                    _this.dispatchError(throwable);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    Application.EventTypes = {
        ERROR: "Application:Error",
        STARTED: "Application:Started",
        STOPPED: "Application:Stopped"
    };

    /**
     * @static
     * @enum {string}
     */
    Application.States = {
        STARTED: "Application:Started",
        STARTING: "Application:Starting",
        STOPPED: "Application:Stopped",
        STOPPING: "Application:Stopping"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugapp.Application', Application);
});
