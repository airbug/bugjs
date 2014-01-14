//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerMaster')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('bugwork.WorkerProcessCreator')
//@Require('bugwork.WorkerProcessStarter')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                         = bugpack.require('Bug');
var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var WorkerProcessCreator        = bugpack.require('bugwork.WorkerProcessCreator');
var WorkerProcessStarter        = bugpack.require('bugwork.WorkerProcessStarter');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $whileParallel              = BugFlow.$whileParallel;
var $iterableParallel           = BugFlow.$iterableParallel;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerMaster = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(workerName, maxConcurrency, debug) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.debug              = debug;

        /**
         * @private
         * @type {number}
         */
        this.maxConcurrency     = maxConcurrency;

        /**
         * @private
         * @type {boolean}
         */
        this.started            = false;

        /**
         * @private
         * @type {boolean}
         */
        this.starting           = false;

        /**
         * @private
         * @type {boolean}
         */
        this.stopping           = false;

        /**
         * @private
         * @type {string}
         */
        this.workerName         = workerName;

        /**
         * @private
         * @type {Set.<WorkerProcess>}
         */
        this.workerProcessSet   = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isDebug: function() {
        return this.debug;
    },

    /**
     * @return {boolean}
     */
    isStarted: function() {
        return this.started;
    },

    /**
     * @return {boolean}
     */
    isStarting: function() {
        return this.starting;
    },

    /**
     * @return {boolean}
     */
    isStopping: function() {
        return this.stopping;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    createWorkers: function(callback) {
        var _this   = this;
        var i       = 0;
        $whileParallel(function(flow) {
                flow.assert(i < _this.maxConcurrency);
            },
            $task(function(flow) {
                i++;
                WorkerMaster.lastDebugPort++;
                var workerProcessCreator = _this.factoryWorkerProcessCreator(_this.isDebug(), WorkerMaster.lastDebugPort);
                workerProcessCreator.createWorkerProcess(function(throwable, workerProcess) {

                    if (throwable) {
                        //TEST
                        console.log("createWorkerProcess callback throwable:", throwable)
                    }

                   console.log("WorkerProcess created");

                    //TODO BRN: What do we do if we received a throwable?
                    if (!throwable) {
                        _this.addWorkerProcess(workerProcess);
                    }
                    flow.complete(throwable);
                });
            })
        ).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    destroyWorkers: function(callback) {
        $iterableParallel(this.workerProcessSet, function(flow, workerProcess) {
            //TODO BRN: Destroy the workers
            flow.complete();
        }).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    startWorkers: function(callback) {
        //TEST
        console.log("WorkerMaster#startWorkers");
        var _this = this;
        $iterableParallel(this.workerProcessSet, function(flow, workerProcess) {
            var workerProcessStarter = new WorkerProcessStarter(workerProcess);
            workerProcessStarter.startWorkerProcess(_this.workerName, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    stopWorkers: function(callback) {

    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {WorkerProcess} workerProcess
     */
    addWorkerProcess: function(workerProcess) {
        this.workerProcessSet.add(workerProcess);
    },

    /**
     * @private
     * @param {boolean} debug
     * @param {number} debugPort
     * @return {WorkerProcessCreator}
     */
    factoryWorkerProcessCreator: function(debug, debugPort) {
        return new WorkerProcessCreator(debug, debugPort);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @type {number}
 */
WorkerMaster.lastDebugPort = 5858;


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerMaster', WorkerMaster);
