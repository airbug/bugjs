//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerProcess')

//@Require('Bug')
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var child_process                   = require('child_process');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                             = bugpack.require('Bug');
var Class                           = bugpack.require('Class');
var Event                           = bugpack.require('Event');
var EventDispatcher                 = bugpack.require('EventDispatcher');
var Exception                       = bugpack.require('Exception');
var TypeUtil                        = bugpack.require('TypeUtil');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugFs                           = bugpack.require('bugfs.BugFs');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerProcess = Class.extend(EventDispatcher, {

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
         * @type {Process}
         */
        this.childProcess       = null;

        /**
         * @private
         * @type {boolean}
         */
        this.created            = false;

        /**
         * @private
         * @type {boolean}
         */
        this.ready              = false;


        var _this = this;
        this.hearChildProcessMessage    = function(message) {
            _this.handleChildProcessMessage(message);
        };
        this.hearStdoutData             = function(data) {
            console.log(data)
        };
        this.hearStderrData             = function(data) {
            console.error(data)
        };
        this.hearProcessClose           = function(code) {
            _this.handleChildProcessClose(code);
        };
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isCreated: function() {
        return this.created;
    },

    /**
     * @return {boolean}
     */
    isReady: function() {
        return this.ready;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    createProcess: function() {
        if (!this.isCreated()) {
            this.created = true;
            var processPath     = BugFs.resolvePaths([__dirname, "../scripts/worker-application-start.js"]);
            this.childProcess   = child_process.fork(processPath.getAbsolutePath(), [], {stdio: 'inherit'});
            this.childProcess.on('message', this.hearChildProcessMessage);
            this.childProcess.on('close', this.hearProcessClose);
        } else {
            throw new Bug("IllegalState", {}, "Process already created");
        }
    },

    /**
     *
     */
    destroyProcess: function() {
        //TODO
    },

    /**
     * @param {*} message
     */
    sendMessage: function(message) {
        this.childProcess.send(message)
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    cleanupProcess: function() {
        if (this.childProcess) {
            this.childProcess.removeListener('message', this.hearChildProcessMessage);
            this.childProcess.removeListener('close', this.hearProcessClose);
            this.childProcess = null;
        }
    },

    /**
     * @private
     * @param {Bug} error
     */
    dispatchError: function(error) {
        this.dispatchEvent(new Event(WorkerProcess.EventTypes.ERROR, {
            error: error
        }));
    },

    /**
     * @private
     * @param {*} message
     */
    dispatchMessage: function(message) {
        this.dispatchEvent(new Event(WorkerProcess.EventTypes.MESSAGE, {
            message: message
        }));
    },

    /**
     * @private
     */
    dispatchReady: function() {
        this.dispatchEvent(new Event(WorkerProcess.EventTypes.READY));
    },

    /**
     * @private
     * @param {number} code
     */
    handleChildProcessClose: function(code) {
        this.resetProcessState();
    },

    /**
     * @private
     * @param {*} message
     */
    handleChildProcessMessage: function(message) {
        if (TypeUtil.isObject(message)) {
            switch (message.type) {
                case "error":
                    this.handleErrorMessage(message);
                    break;
                case "workerReady":
                    this.handleWorkerReadyMessage(message);
                    break;
                default:
                    this.dispatchMessage(message);
            }
        } else {
            console.log("Unhandled process message:" + message);
        }
    },

    /**
     * @private
     * @param {*} message
     */
    handleErrorMessage: function(message) {
        var error = new Bug("ChildProcessError", {}, message.data.message);
        error.stack = message.data.stack;
        this.dispatchError(error);
    },

    /**
     * @private
     * @param {*} message
     */
    handleWorkerReadyMessage: function(message) {
        if (!this.isReady()) {
            this.ready = true;
            this.dispatchReady();
        } else {
            this.dispatchError(new Bug("IllegalState", {}, "Process is already ready. Received a worker ready message after already ready"));
        }
    },

    /**
     * @private
     */
    resetProcessState: function() {
        this.ready = false;
        this.created = false;
        this.cleanupProcess();
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
WorkerProcess.EventTypes = {
    CLOSED: "WorkerProcess:Closed",
    ERROR: "WorkerProcess:Error",
    MESSAGE: "WorkerProcess:Message",
    READY: "WorkerProcess:Ready"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerProcess', WorkerProcess);
