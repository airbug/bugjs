//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('StartWorkerCommand')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('bugwork.WorkerCommand')
//@Require('bugwork.WorkerDefines')
//@Require('bugwork.WorkerProcess')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var WorkerCommand       = bugpack.require('bugwork.WorkerCommand');
var WorkerDefines       = bugpack.require('bugwork.WorkerDefines');
var WorkerProcess       = bugpack.require('bugwork.WorkerProcess');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {WorkerCommand}
 */
var StartWorkerCommand = Class.extend(WorkerCommand, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(workerContext, marshaller) {

        this._super(workerContext);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Throwable=)}
         */
        this.callback       = null;

        /**
         * @private
         * @type {boolean}
         */
        this.completed      = false;

        /**
         * @private
         * @type {Marshaller}
         */
        this.marshaller     = marshaller;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isCompleted: function() {
        return this.completed;
    },


    //-------------------------------------------------------------------------------
    // Command Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {function(Throwable=)} callback
     */
    executeCommand: function(callback) {
        this.callback       = callback;
        var workerContext   = this.getWorkerContext();
        if (workerContext.isReady()) {
            this.startWorker();
        } else if (workerContext.isRunning()) {
            this.complete();
        } else {
            this.complete(new Exception("IllegalState", {}, "Worker is not ready and cannot have start called on it"));
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {WorkerProcess} workerProcess
     */
    addProcessListeners: function(workerProcess) {
        workerProcess.addEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
        workerProcess.addEventListener(WorkerProcess.EventTypes.MESSAGE, this.hearProcessMessage, this);
        workerProcess.addEventListener(WorkerProcess.EventTypes.THROWABLE, this.hearProcessThrowable, this);
    },

    /**
     * @private
     * @param {Throwable=} throwable
     */
    complete: function(throwable) {
        if (!this.completed) {
            this.completed = true;
            this.removeProcessListeners(this.getWorkerContext().getWorkerProcess());
            this.workerContext = null;
            if (!throwable) {
                this.callback();
            } else {
                this.callback(throwable);
            }
        } else {
            throw new Bug("IllegalState", {}, "Starter already complete");
        }
    },

    /**
     * @private
     * @param {*} message
     */
    processMessage: function(message) {

        console.log("StartWorkerCommand#processMessage - message:", message);

        if (message.messageType === WorkerDefines.MessageTypes.WORKER_STARTED) {
            this.getWorkerContext().updateWorkerState(WorkerDefines.State.RUNNING);
            this.complete();
        }
    },

    /**
     * @private
     * @param {WorkerProcess} workerProcess
     */
    removeProcessListeners: function(workerProcess) {
        workerProcess.removeEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
        workerProcess.removeEventListener(WorkerProcess.EventTypes.MESSAGE, this.hearProcessMessage, this);
        workerProcess.removeEventListener(WorkerProcess.EventTypes.THROWABLE, this.hearProcessThrowable, this);
    },

    /**
     * @private
     */
    startWorker: function() {
        var workerContext   = this.getWorkerContext();
        var workerName      = workerContext.getWorkerName();
        var logMessage      = "Starting worker '" + workerName + "'";
        if (workerContext.isDebug()) {
            logMessage += " in debug mode running on port " + workerContext.getDebugPort();
        }
        console.log(logMessage);
        this.addProcessListeners(workerContext.getWorkerProcess());
        workerContext.getWorkerProcess().sendMessage(WorkerDefines.MessageTypes.START_WORKER, {
            workerName: workerName
        });
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearProcessClosed: function(event) {
        this.complete(new Exception("Worker closed before ready event"));
    },

    /**
     * @private
     * @param {Event} event
     */
    hearProcessMessage: function(event) {
        var message = event.getData().message;
        this.processMessage(message);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearProcessThrowable: function(event) {
        this.complete(event.getData().throwable);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.StartWorkerCommand', StartWorkerCommand);