//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerProcessStarter')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
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
var Obj                 = bugpack.require('Obj');
var WorkerProcess       = bugpack.require('bugwork.WorkerProcess');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerProcessStarter = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(workerProcess) {

        this._super();


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
         * @type {boolean}
         */
        this.started        = false;

        /**
         * @private
         * @type {WorkerProcess}
         */
        this.workerProcess  = workerProcess;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {WorkerProcess}
     */
    getWorkerProcess: function() {
        return this.workerProcess;
    },

    /**
     * @return {boolean}
     */
    isStarted: function() {
        return this.started;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} workerName
     * @param {function(Throwable=)} callback
     */
    startWorkerProcess: function(workerName, callback) {

        //TEST
        console.log("WorkerProcessStarter#sartWorkerProcess - this.isStarted():", this.isStarted());

        if (!this.isStarted()) {
            var logMessage = "Starting worker '" + workerName + "'";
            if (this.workerProcess.isDebug()) {
                logMessage += " in debug mode running on port " + this.workerProcess.getDebugPort();
            }
            console.log(logMessage);
            this.created        = true;
            this.callback       = callback;
            this.addProcessListeners();
            this.workerProcess.sendMessage({
                type: "startWorker",
                data: {
                    workerName: workerName
                }
            });
        } else {
            throw new Bug("IllegalState", {}, "");
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    addProcessListeners: function() {
        this.workerProcess.addEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
        this.workerProcess.addEventListener(WorkerProcess.EventTypes.ERROR, this.hearProcessError, this);
        this.workerProcess.addEventListener(WorkerProcess.EventTypes.MESSAGE, this.hearProcessMessage, this);
    },

    /**
     * @private
     */
    complete: function() {
        if (!this.completed) {
            this.completed = true;
            this.removeEventListeners();
            this.callback();
        } else {
            throw new Bug("IllegalState", {}, "Starter already complete");
        }
    },

    /**
     * @private
     * @param {Bug} error
     */
    completeWithError: function(error) {
        if (!this.completed) {
            this.completed = true;
            this.removeEventListeners();
            this.callback(error);
        } else {
            throw new Bug("IllegalState", {}, "Starter already complete");
        }
    },

    /**
     * @private
     * @param {*} message
     */
    processMessage: function(message) {

        console.log("WorkerProcessStarter#processMessage - message:", message);

        if (message.type === "workerStarted") {
            this.complete();
        }
    },

    /**
     * @private
     */
    removeEventListeners: function() {
        this.workerProcess.removeEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
        this.workerProcess.removeEventListener(WorkerProcess.EventTypes.ERROR, this.hearProcessError, this);
        this.workerProcess.removeEventListener(WorkerProcess.EventTypes.MESSAGE, this.hearProcessMessage, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearProcessClosed: function(event) {
        this.completeWithError(new Bug("Worker closed before ready event"));
    },

    /**
     * @private
     * @param {Event} event
     */
    hearProcessError: function(event) {
        this.completeWithError(event.getData().error);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearProcessMessage: function(event) {
        var message = event.getData().message;
        this.processMessage(message);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerProcessStarter', WorkerProcessStarter);
