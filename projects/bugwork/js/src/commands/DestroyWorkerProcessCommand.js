//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.DestroyWorkerProcessCommand')

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
var DestroyWorkerProcessCommand = Class.extend(WorkerCommand, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(workerContext) {

        this._super(workerContext);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Throwable=)}
         */
        this.callback                   = null;

        /**
         * @private
         * @type {boolean}
         */
        this.completed                  = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(Throwable=)}
     */
    getCallback: function() {
        return this.callback;
    },


    //-------------------------------------------------------------------------------
    // Command Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {function(Throwable==)} callback
     */
    executeCommand: function(callback) {
        this.callback       = callback;
        var workerContext   = this.getWorkerContext();
        if (workerContext.hasWorkerProcess()) {
            if (!workerContext.isRunning()) {
                this.destroyWorkerProcess();
            } else {
                this.complete(new Exception("IllegalState", {}, "Worker is still running. Must be stopped first before we can destroy it."));
            }
        } else {
            this.complete();
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
        workerProcess.addEventListener(WorkerProcess.EventTypes.THROWABLE, this.hearProcessThrowable, this);
    },

    /**
     * @private
     * @param {Throwable=} throwable
     */
    complete: function(throwable) {
        if (!this.completed) {
            this.completed = true;
            if (this.getWorkerContext().hasWorkerProcess()) {
                this.removeProcessListeners(this.getWorkerContext().getWorkerProcess());
            }
            this.workerContext = null;
            if (!throwable) {
                this.callback();
            } else {
                this.callback(throwable);
            }
        } else {
            throw new Bug("IllegalState", {}, "Stopper already complete");
        }
    },

    /**
     * @private
     */
    destroyWorkerProcess: function() {
        var workerContext   = this.getWorkerContext();
        var workerName      = workerContext.getWorkerName();
        console.log("Destroying worker '" + workerName + "'");
        this.addProcessListeners(workerContext.getWorkerProcess());
        workerContext.getWorkerProcess().destroyProcess();
    },

    /**
     * @private
     * @param {WorkerProcess} workerProcess
     */
    removeProcessListeners: function(workerProcess) {
        workerProcess.removeEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
        workerProcess.removeEventListener(WorkerProcess.EventTypes.THROWABLE, this.hearProcessThrowable, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearProcessClosed: function(event) {
        this.getWorkerContext().clearWorkerProcess();
        this.complete();
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

bugpack.export('bugwork.DestroyWorkerProcessCommand', DestroyWorkerProcessCommand);
