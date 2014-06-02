//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerContext')

//@Require('Bug')
//@Require('Class')
//@Require('CommandProcessor')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('bugflow.BugFlow')
//@Require('bugwork.WorkerDefines')
//@Require('bugwork.WorkerProcess')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                         = bugpack.require('Bug');
    var Class                       = bugpack.require('Class');
    var CommandProcessor            = bugpack.require('CommandProcessor');
    var Event                       = bugpack.require('Event');
    var EventDispatcher             = bugpack.require('EventDispatcher');
    var Exception                   = bugpack.require('Exception');
    var BugFlow                     = bugpack.require('bugflow.BugFlow');
    var WorkerDefines               = bugpack.require('bugwork.WorkerDefines');
    var WorkerProcess               = bugpack.require('bugwork.WorkerProcess');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series                     = BugFlow.$series;
    var $task                       = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var WorkerContext = Class.extend(EventDispatcher, {

        _name: "bugwork.WorkerContext",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} workerName
         * @param {boolean=} debug
         * @param {number=} debugPort
         * @param {Logger} logger
         * @param {WorkerCommandFactory} workerCommandFactory
         */
        _constructor: function(workerName, debug, debugPort, logger, workerCommandFactory) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandProcessor}
             */
            this.commandProcessor       = new CommandProcessor();

            /**
             * @private
             * @type {boolean}
             */
            this.debug                  = debug;

            /**
             * @private
             * @type {number}
             */
            this.debugPort              = debugPort;

            /**
             * @private
             * @type {WorkerDefines.State}
             */
            this.desiredWorkerState     = WorkerDefines.State.NOT_READY;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                 = logger;

            /**
             * @private
             * @type {string}
             */
            this.workerName             = workerName;

            /**
             * @private
             * @type {WorkerProcess}
             */
            this.workerProcess          = null;

            /**
             * @private
             * @type {WorkerCommandFactory}
             */
            this.workerCommandFactory   = workerCommandFactory;

            /**
             * @private
             * @type {WorkerDefines.State}
             */
            this.workerState            = WorkerDefines.State.NOT_READY;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getDebugPort: function() {
            return this.debugPort;
        },

        /**
         * @return {string}
         */
        getWorkerName: function() {
            return this.workerName;
        },

        /**
         * @return {WorkerProcess}
         */
        getWorkerProcess: function() {
            return this.workerProcess;
        },

        /**
         * @return {WorkerDefines.State}
         */
        getWorkerState: function() {
            return this.workerState;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasWorkerProcess: function() {
            return !!this.workerProcess;
        },

        /**
         * @return {boolean}
         */
        isCreated: function() {
            return this.isReady() || this.isRunning();
        },

        /**
         * @return {boolean}
         */
        isDebug: function() {
            return this.debug;
        },

        /**
         * @return {boolean}
         */
        isReady: function() {
            return this.workerState === WorkerDefines.State.READY;
        },

        /**
         * @return {boolean}
         */
        isRunning: function() {
            return this.workerState === WorkerDefines.State.RUNNING;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        createAndStartWorker: function(callback) {
            var commands = [
                this.workerCommandFactory.factoryCreateWorkerProcessCommand(this),
                this.workerCommandFactory.factoryStartWorkerCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        stopAndDestroyWorker: function(callback) {
            var commands = [
                this.workerCommandFactory.factoryStopWorkerCommand(this),
                this.workerCommandFactory.factoryDestroyWorkerProcessCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        recreateWorker: function(callback) {
            var commands = [
                this.workerCommandFactory.factoryStopWorkerCommand(this),
                this.workerCommandFactory.factoryDestroyWorkerProcessCommand(this),
                this.workerCommandFactory.factoryCreateWorkerProcessCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        restartWorker: function(callback) {
            var commands = [
                this.workerCommandFactory.factoryStopWorkerCommand(this),
                this.workerCommandFactory.factoryDestroyWorkerProcessCommand(this),
                this.workerCommandFactory.factoryCreateWorkerProcessCommand(this),
                this.workerCommandFactory.factoryStartWorkerCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        startWorker: function(callback) {
            var commands = [
                this.workerCommandFactory.factoryStartWorkerCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        stopWorker: function(callback) {
            var commands = [
                this.workerCommandFactory.factoryStopWorkerCommand(this)
            ];
            this.commandProcessor.processCommands(commands, callback);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        clearWorkerProcess: function() {
            if (this.workerProcess) {
                this.cleanupWorkerProcess();
            }
        },

        /**
         * @param {WorkerProcess} workerProcess
         */
        updateWorkerProcess: function(workerProcess) {
            if (this.workerProcess) {
                this.cleanupWorkerProcess();
            }
            this.workerProcess = workerProcess;
            this.addProcessListeners();
        },

        /**
         * @protected
         * @param {WorkerDefines.State} workerState
         */
        updateWorkerState: function(workerState) {
            this.workerState = workerState;
            this.desiredWorkerState = workerState;
            this.dispatchStateChanged();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        alertRestartWorker: function() {
            this.logger.warn("Worker restarted - workerName:", this.workerName);
            this.dispatchAlertRestarted();
        },

        /**
         * @private
         * @param {Throwable} throwable
         */
        alertRestartWorkerWithThrowable: function(throwable) {
            this.logger.error(throwable);
            this.alertRestartWorker();
        },

        /**
         * @private
         */
        addProcessListeners: function() {
            this.workerProcess.addEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
            this.workerProcess.addEventListener(WorkerProcess.EventTypes.READY, this.hearProcessReady, this);
            this.workerProcess.addEventListener(WorkerProcess.EventTypes.THROWABLE, this.hearProcessThrowable, this);
        },

        /**
         * @private
         */
        checkState: function() {
            var _this = this;
            if (this.desiredWorkerState === WorkerDefines.State.READY) {
                this.alertRestartWorker();
                this.recreateWorker(function(throwable) {
                    if (throwable) {
                        _this.dispatchThrowable(throwable);
                    }
                });
            } else if (this.workerState === WorkerDefines.State.RUNNING) {
                this.alertRestartWorker();
                this.restartWorker(function(throwable) {
                    if (throwable) {
                        _this.dispatchThrowable(throwable);
                    }
                });
            }
        },

        /**
         * @private
         * @param {Throwable} throwable
         */
        checkStateAfterThrowable: function(throwable) {
            this.alertRestartWorkerWithThrowable(throwable);
            this.checkState();
        },

        /**
         * @private
         */
        cleanupWorkerProcess: function() {
            this.removeProcessListeners();
            this.workerProcess = null;
            this.workerState = WorkerDefines.State.NOT_READY;
        },

        /**
         * @private
         */
        dispatchAlertRestarted: function() {
            this.dispatchEvent(new Event(WorkerContext.EventTypes.ALERT_RESTARTED));
        },

        /**
         * @private
         */
        dispatchStateChanged: function() {
            this.dispatchEvent(new Event(WorkerContext.EventTypes.STATE_CHANGED, {
                workerState: this.workerState
            }));
        },

        /**
         * @private
         * @param {Throwable} throwable
         */
        dispatchThrowable: function(throwable) {
            this.dispatchEvent(new Event(WorkerContext.EventTypes.STATE_CHANGED, {
                throwable: this.throwable
            }));
        },

        /**
         * @private
         */
        removeProcessListeners: function() {
            this.workerProcess.removeEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
            this.workerProcess.removeEventListener(WorkerProcess.EventTypes.READY, this.hearProcessReady, this);
            this.workerProcess.removeEventListener(WorkerProcess.EventTypes.THROWABLE, this.hearProcessThrowable, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearProcessClosed: function(event) {
            this.cleanupWorkerProcess();
            this.checkState();
        },

        /**
         * @private
         * @param {Event} event
         */
        hearProcessThrowable: function(event) {
            this.checkStateAfterThrowable(event.getData().throwable);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    WorkerContext.EventTypes = {
        ALERT_RESTARTED: "WorkerContext:AlertRestarted",
        STATE_CHANGED: "WorkerContext:StateChanged",
        THROWABLE: "WorkerContext:Throwable"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugwork.WorkerContext', WorkerContext);
});
