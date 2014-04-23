//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugapp.Application')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var Event                               = bugpack.require('Event');
    var EventDispatcher                     = bugpack.require('EventDispatcher');
    var ConfigurationAnnotationProcessor    = bugpack.require('bugioc.ConfigurationAnnotationProcessor');
    var ConfigurationScan                   = bugpack.require('bugioc.ConfigurationScan');
    var IocContext                          = bugpack.require('bugioc.IocContext');
    var ModuleAnnotationProcessor           = bugpack.require('bugioc.ModuleAnnotationProcessor');
    var ModuleScan                          = bugpack.require('bugioc.ModuleScan');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');


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
             * @type {ConfigurationScan}
             */
            this.configurationScan  = new ConfigurationScan(BugMeta.context(), new ConfigurationAnnotationProcessor(this.iocContext));

            /**
             * @private
             * @type {ModuleScan}
             */
            this.moduleScan         = new ModuleScan(BugMeta.context(), new ModuleAnnotationProcessor(this.iocContext));

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
         * @return {ConfigurationScan}
         */
        getConfigurationScan: function() {
            return this.configurationScan;
        },

        /**
         * @return {IocContext}
         */
        getIocContext: function() {
            return this.iocContext;
        },

        /**
         * @return {ModuleScan}
         */
        getModuleScan: function() {
            return this.moduleScan;
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
