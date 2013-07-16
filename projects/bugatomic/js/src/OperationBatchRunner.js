//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugatomic')

//@Export('OperationBatchRunner')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('bugatomic.Operation')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var Set             = bugpack.require('Set');
var Operation       = bugpack.require('bugatomic.Operation');
var BugFlow         = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableParallel   = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

var OperationBatchRunner = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {OperationBatch} operationBatch
     * @param {ILockOperator} lockOperator
     */
    _constructor: function(key, operationBatch, lockOperator) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.key                        = key;

        /**
         * @private
         * @type {LockOperator}
         */
        this.lockOperator               = lockOperator;

        /**
         * @private
         * @type {OperationBatch}
         */
        this.operationBatch             = operationBatch;

        /**
         * @private
         * @type {Set.<Operation>}
         */
        this.runningOperationSet        = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    run: function() {
        var _this = this;
        this.acquireLocks(function() {
            _this.runOperationBatch();
        });
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function()} callback
     */
    acquireLocks: function(callback)  {
        var _this = this;
        var lockSet = this.operationBatch.getLockSet();
        $iterableParallel(lockSet, function(flow, lock) {
            _this.lockOperator.acquireLock(_this.key, lock, function() {
                flow.complete();
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {Operation} operation
     */
    completeOperation: function(operation) {
        this.runningOperationSet.remove(operation);
        operation.off(Operation.EventTypes.COMPLETE, this.hearOperationComplete, this);
        if (this.runningOperationSet.isEmpty()) {
            this.completeRun();
        }
    },

    /**
     * @private
     */
    completeRun: function() {
        this.releaseLocks();
        this.dispatchEvent(new Event(OperationBatchRunner.EventTypes.RUN_COMPLETE));
    },

    /**
     * @private
     */
    releaseLocks: function() {
        var _this = this;
        var lockSet = this.operationBatch.getLockSet();
        lockSet.forEach(function(lock) {
            _this.lockOperator.releaseLock(_this.key, lock);
        });
    },

    /**
     * @private
     */
    runOperationBatch: function() {
        var operationList = this.operationBatch.getOperationList();
        this.runningOperationSet.addAll(operationList);
        operationList.forEach(function(operation) {
            operation.on(Operation.EventTypes.COMPLETE, this.hearOperationComplete, this);
            operation.run();
        });
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearOperationComplete: function(event) {
        var operation = event.getTarget();
        this.completeOperation(operation);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
OperationBatchRunner.EventTypes = {
    RUN_COMPLETE: "OperationBatchRunner:RunComplete"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugatomic.OperationBatchRunner', OperationBatchRunner);
