//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerProcessCreator')

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

var WorkerProcessCreator = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Throwable, WorkerProcess=)}
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
        this.created        = false;

        /**
         * @private
         * @type {WorkerProcess}
         */
        this.workerProcess  = null;
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
    isCreated: function() {
        return this.created;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, WorkerProcess=)} callback
     */
    createWorkerProcess: function(callback) {

        //TEST
        console.log("WorkerProcessCreator#createWorkerProcess - this.isCreated():", this.isCreated());

        if (!this.isCreated()) {
            this.created        = true;
            this.callback       = callback;
            this.workerProcess  = this.factoryWorkerProcess();
            this.addProcessListeners();
            this.workerProcess.createProcess();
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
        this.workerProcess.addEventListener(WorkerProcess.EventTypes.READY, this.hearProcessReady, this);
    },

    /**
     * @private
     */
    complete: function() {
        if (!this.completed) {
            this.completed = true;
            this.removeEventListeners();
            this.callback(null, this.workerProcess);
        } else {
            throw new Bug("IllegalState", {}, "Creator already complete");
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
            throw new Bug("IllegalState", {}, "Creator already complete");
        }
    },

    /**
     * @private
     * @returns {WorkerProcess}
     */
    factoryWorkerProcess: function() {
        return new WorkerProcess();
    },

    /**
     * @private
     */
    removeEventListeners: function() {
        this.workerProcess.removeEventListener(WorkerProcess.EventTypes.CLOSED, this.hearProcessClosed, this);
        this.workerProcess.removeEventListener(WorkerProcess.EventTypes.ERROR, this.hearProcessError, this);
        this.workerProcess.removeEventListener(WorkerProcess.EventTypes.READY, this.hearProcessReady, this);
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
    hearProcessReady: function(event) {
        this.complete();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerProcessCreator', WorkerProcessCreator);
