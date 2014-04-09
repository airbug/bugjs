//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerMaster')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')


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


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableParallel           = BugFlow.$iterableParallel;
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;
var $whileParallel              = BugFlow.$whileParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerMaster = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(workerName, maxConcurrency, debug, workerContextFactory) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.debug                      = debug;

        /**
         * @private
         * @type {number}
         */
        this.maxConcurrency             = maxConcurrency;

        /**
         * @private
         * @type {WorkerContextFactory}
         */
        this.workerContextFactory       = workerContextFactory;

        /**
         * @private
         * @type {string}
         */
        this.workerName                 = workerName;

        /**
         * @private
         * @type {Set.<WorkerContext>}
         */
        this.workerContextSet           = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<WorkerContext>}
     */
    getWorkerContextSet: function() {
        return this.workerContextSet;
    },

    /**
     * @return {boolean}
     */
    isDebug: function() {
        return this.debug;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    createAndStartWorkers: function(callback) {
        var _this   = this;
        var i       = 0;
        $whileParallel(function(flow) {
                flow.assert(i < _this.maxConcurrency);
            },
            $task(function(flow) {
                i++;
                _this.createAndStartWorker(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    startWorkers: function(callback) {
        var _this = this;
        $iterableParallel(this.workerContextSet, function(flow, workerContext) {
            _this.startWorker(workerContext, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    stopAndDestroyWorkers: function(callback) {
        var _this = this;
        $iterableParallel(this.workerContextSet, function(flow, workerContext) {
            _this.stopAndDestroyWorker(workerContext, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    stopWorkers: function(callback) {
        var _this = this;
        $iterableParallel(this.workerContextSet, function(flow, workerContext) {
            _this.stopWorker(workerContext, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {WorkerContext} workerContext
     */
    addWorkerContext: function(workerContext) {
        this.workerContextSet.add(workerContext);
    },

    /**
     * @private
     * @param {function(Throwable=)} callback
     */
    createAndStartWorker: function(callback) {
        var _this = this;
        $task(function(flow) {
            WorkerMaster.lastDebugPort++;
            var workerContext = _this.workerContextFactory.factoryWorkerContext(_this.workerName, _this.isDebug(), WorkerMaster.lastDebugPort);
            workerContext.createAndStartWorker(function(throwable) {
                if (!throwable) {
                    _this.addWorkerContext(workerContext);
                }
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {WorkerContext} workerContext
     */
    removeWorkerContext: function(workerContext) {
        this.workerContextSet.remove(workerContext);
    },

    /**
     * @private
     * @param {WorkerContext} workerContext
     * @param {function(Throwable=)} callback
     */
    startWorker: function(workerContext, callback) {
        $task(function(flow) {
            workerContext.startWorker(function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {WorkerContext} workerContext
     * @param {function(Throwable=)} callback
     */
    stopAndDestroyWorker: function(workerContext, callback) {
        var _this = this;
        $task(function(flow) {
            workerContext.stopAndDestroyWorker(function(throwable) {
                if (!throwable) {
                    _this.removeWorkerContext(workerContext);
                }
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {WorkerContext} workerContext
     * @param {function(Throwable=)} callback
     */
    stopWorker: function(workerContext, callback) {
        $task(function(flow) {
            workerContext.stopWorker(function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
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
