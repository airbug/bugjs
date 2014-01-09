//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerRunner')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                             = bugpack.require('Bug');
var Class                           = bugpack.require('Class');
var Exception                       = bugpack.require('Exception');
var Obj                             = bugpack.require('Obj');
var TypeUtil                        = bugpack.require('TypeUtil');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerRunner = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {WorkerRegistry} workerRegistry
     */
    _constructor: function(workerRegistry) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.state              = WorkerRunner.States.STOPPED;

        /**
         * @private
         * @type {Worker}
         */
        this.worker             = null;

        /**
         * @private
         * @type {WorkerRegistry}
         */
        this.workerRegistry     = workerRegistry;

        var _this = this;
        this.hearProcessMessage = function(message) {
            _this.handleProcessMessage(message);
        };
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getState: function() {
        return this.state;
    },

    /**
     * @return {boolean}
     */
    isStarted: function() {
        return this.state == WorkerRunner.States.STARTED;
    },

    /**
     * @return {boolean}
     */
    isStarting: function() {
        return this.state === WorkerRunner.States.STARTING;
    },


    /**
     * @return {boolean}
     */
    isStopped: function() {
        return this.state === WorkerRunner.States.STOPPED;
    },

    /**
     * @return {boolean}
     */
    isStopping: function() {
        return this.state === WorkerRunner.States.STOPPING;
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        var _this = this;
        process.off('message', _this.hearProcessMessage);
        this.stopWorker(function(throwable) {
            callback(throwable);
        });
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        process.on('message', this.hearProcessMessage);
        callback();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} workerName
     */
    generateWorker: function(workerName) {

        //TEST
        console.log("WorkerRunner#generateWorker - workerName:", workerName);

        var workerRegistryEntry = this.workerRegistry.getRegistryEntryForName(workerName);
        if (workerRegistryEntry) {
            var workerClass = workerRegistryEntry.getWorkerClass();
            this.worker = new workerClass();
        } else {
            throw new Exception("IllegalState", {}, "no registry entry by the name '" + workerName + "'");
        }
    },

    /**
     * @private
     * @param {*} message
     */
    handleProcessMessage: function(message) {

        //TEST
        console.log("WorkerRunner#handleProcessMessage - message:", message);

        console.log("TypeUtil.isObject(message):", TypeUtil.isObject(message));
        console.log("message.type:", message.type);

        if (TypeUtil.isObject(message)) {
            if (message.type === "startWorker") {
                this.processStartWorkerMessage(message, function(throwable) {
                    if (!throwable) {
                        process.send({
                            type: "workerStarted"
                        });
                    } else {
                        process.send({
                            type: "exception",
                            data: {
                                message: throwable.message,
                                stack: throwable.stack
                            }
                        });
                    }
                });
            }
        }
    },

    /**
     * @private
     * @param {Object }message
     * @param {function(Throwable=)} callback
     */
    processStartWorkerMessage: function(message, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                if (!_this.isStarted()) {
                    var data = message.data;
                    _this.generateWorker(data.workerName);
                    _this.startWorker(function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.error(new Exception("IllegalState", {}, "Worker already started"));
                }
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    startWorker: function(callback) {

        //TEST
        console.log("WorkerRunner#startWorker - this.isStopped():", this.isStopped());

        var _this = this;
        if (this.isStopped()) {
            this.state = WorkerRunner.States.STARTING;
            this.worker.start(function(throwable) {
                if (!throwable) {
                    _this.state = WorkerRunner.States.STARTED;
                }
                callback(throwable);
            });
        } else {
            callback();
        }
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    stopWorker: function(callback) {
        var _this = this;
        if (this.isStarted()) {
            this.state = WorkerRunner.States.STOPPING;
            this.worker.stop(function(throwable) {
                _this.state = WorkerRunner.States.STOPPED;
                callback(throwable);
            });
        } else {
            callback();
        }
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
WorkerRunner.States = {
    STARTED: "State:Started",
    STARTING: "State:Starting",
    STOPPED: "State:Stopped",
    STOPPING: "State:Stopping"
};


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(WorkerRunner, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkerRunner).with(
    module("workerRunner")
        .args([
            arg().ref("workerRegistry")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerRunner', WorkerRunner);
