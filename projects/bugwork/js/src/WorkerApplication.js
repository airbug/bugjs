//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerApplication')
//@Autoload

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerApplication = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocContext}
         */
        this.iocContext         = new IocContext();

        /**
         * @private
         * @type {ModuleScan}
         */
        this.moduleScan         = new ModuleScan(new ModuleAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {string}
         */
        this.state              = WorkerApplication.States.STOPPED;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isStarted: function() {
        return this.state === WorkerApplication.States.STARTED;
    },

    /**
     * @return {boolean}
     */
    isStarting: function() {
        return this.state === WorkerApplication.States.STARTING;
    },

    /**
     * @return {boolean}
     */
    isStopped: function() {
        return this.state === WorkerApplication.States.STOPPED;
    },

    /**
     * @return {boolean}
     */
    isStopping: function() {
       return this.state === WorkerApplication.States.STOPPING;
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
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Throwable} throwable
     */
    dispatchError: function(throwable) {
        this.dispatchEvent(new Event(WorkerApplication.EventTypes.ERROR, {
            error: throwable
        }));
    },

    /**
     * @private
     */
    dispatchStarted: function() {
        this.dispatchEvent(new Event(WorkerApplication.EventTypes.STARTED));
    },

    /**
     * @private
     */
    dispatchStopped: function() {
        this.dispatchEvent(new Event(WorkerApplication.EventTypes.STOPPED));
    },

    /**
     * @private
     */
    startApplication: function() {
        var _this   = this;
        this.state  = WorkerApplication.States.STARTING;
        this.moduleScan.scanBugpacks([
            "bugmarsh.MarshRegistry",
            "bugmarsh.Marshaller",
            "bugwork.WorkerRegistry",
            "bugwork.WorkerRunner"
        ]);
        this.iocContext.process();
        this.iocContext.initialize(function(throwable) {
            if (!throwable) {
                _this.state = WorkerApplication.States.STARTED;
                _this.dispatchStarted();
            } else {
                _this.dispatchError(throwable);
            }
        });
    },

    /**
     * @private
     */
    stopApplication: function() {
        var _this   = this;
        this.state  = WorkerApplication.States.STOPPING;
        this.iocContext.deinitialize(function(throwable) {
            if (!throwable) {
                _this.state = WorkerApplication.States.STOPPED;
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
WorkerApplication.EventTypes = {
    ERROR: "WorkerApplication:Error",
    STARTED: "WorkerApplication:Started",
    STOPPED: "WorkerApplication:Stopped"
};

/**
 * @static
 * @enum {string}
 */
WorkerApplication.States = {
    STARTED: "WorkerApplication:Started",
    STARTING: "WorkerApplication:Starting",
    STOPPED: "WorkerApplication:Stopped",
    STOPPING: "WorkerApplication:Stopping"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerApplication', WorkerApplication);
