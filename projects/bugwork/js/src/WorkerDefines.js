//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerDefines = {};


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
WorkerDefines.MessageTypes = {
    START_WORKER: "WorkerDefines:StartWorker",
    STOP_WORKER: "WorkerDefines:StopWorker",
    WORKER_ERROR: "WorkerDefines:WorkerError",
    WORKER_READY: "WorkerDefines:WorkerReady",
    WORKER_STARTED: "WorkerDefines:WorkerStarted",
    WORKER_STOPPED: "WorkerDefines:WorkerStopped",
    WORKER_THROWABLE: "WorkerDefines:WorkerThrowable"
};


/**
 * @static
 * @enum {string}
 */
 WorkerDefines.State = {
    NOT_READY: "WorkerDefines:State:NotReady",
    READY: "WorkerDefines:State:Ready",
    RUNNING: "WorkerDefines:State:Running"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("bugwork.WorkerDefines", WorkerDefines);
