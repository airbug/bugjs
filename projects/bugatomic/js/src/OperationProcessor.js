//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugatomic.OperationProcessor')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('List')
//@Require('Map')
//@Require('Set')
//@Require('bugatomic.Operation')
//@Require('bugatomic.OperationBatch')
//@Require('bugatomic.OperationBatchRunner')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EventDispatcher         = bugpack.require('EventDispatcher');
var List                    = bugpack.require('List');
var Map                     = bugpack.require('Map');
var Set                     = bugpack.require('Set');
var Operation               = bugpack.require('bugatomic.Operation');
var OperationBatch          = bugpack.require('bugatomic.OperationBatch');
var OperationBatchRunner    = bugpack.require('bugatomic.OperationBatchRunner');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

var OperationProcessor = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {ILockOperator} lockOperator
     */
    _constructor: function(key, lockOperator) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {OperationBatch}
         */
        this.currentOperationBatch      = null;

        /**
         * @private
         * @type {number}
         */
        this.delayTimeoutId             = null;

        /**
         * @private
         * @type {string}
         */
        this.key                        = key;

        /**
         * @private
         * @type {ILockOperator}
         */
        this.lockOperator               = lockOperator;

        /**
         * @private
         * @type {List.<OperationBatchRunner}
         */
        this.operationBatchRunnerList   = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getKey: function() {
        return this.key;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Operation} operation
     * @param {boolean} batch
     */
    process: function(operation, batch) {
        this.scheduleOperation(operation, batch);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {OperationBatchRunner} operationBatchRunner
     */
    cleanupRun: function(operationBatchRunner) {
        this.operationBatchRunnerList.remove(operationBatchRunner);
        operationBatchRunner.off(OperationBatchRunner.EventTypes.RUN_COMPLETE, this.hearRunComplete, this);
        if (this.operationBatchRunnerList.isEmpty() && !this.currentOperationBatch) {
            this.noMoreOperations();
        }
    },

    /**
     * @private
     */
    clearDelayedRun: function() {
        if (this.delayTimeoutId) {
            clearTimeout(this.delayTimeoutId);
        }
    },

    /**
     * @private
     */
    delayRunOperationBatch: function() {
        var _this = this;
        if (!this.delayTimeoutId) {
            this.delayTimeoutId = setTimeout(function() {
                _this.delayTimeoutId = null;
                _this.runOperationBatch(_this.currentOperationBatch);
            }, 0);
        }
    },

    /**
     * @private
     * @param {string} type
     * @param {Set.<string>} locks
     * @return {OperationBatch}
     */
    factoryOperationBatch: function(type, locks) {
        return new OperationBatch(type, locks);
    },

    /**
     * @private
     * @param {OperationBatch} operationBatch
     * @return {OperationBatchRunner}
     */
    factoryOperationBatchRunner: function(operationBatch) {
        return new OperationBatchRunner(this.key, operationBatch, this.lockOperator);
    },

    /**
     * @private
     */
    noMoreOperations: function() {
        this.dispatchEvent(new Event(OperationProcessor.EventTypes.NO_MORE_OPERATIONS));
    },

    /**
     * @private
     */
    runCurrentOperationBatch: function() {
        this.clearDelayedRun();
        var operationBatch = this.currentOperationBatch;
        this.currentOperationBatch = null;
        this.runOperationBatch(operationBatch);
    },

    /**
     * @private
     * @param {OperationBatch} operationBatch
     */
    runOperationBatch: function(operationBatch) {
        var operationBatchRunner = this.factoryOperationBatchRunner(operationBatch);
        this.operationBatchRunnerList.add(operationBatchRunner);
        operationBatchRunner.on(OperationBatchRunner.EventTypes.RUN_COMPLETE, this.hearRunComplete, this);
        operationBatchRunner.run();
    },

    /**
     * @private
     * @param {Operation} operation
     * @param {boolean} batch
     */
    scheduleOperation: function(operation, batch) {
        var operationBatch = this.currentOperationBatch;
        if (!operationBatch) {
            operationBatch = this.factoryOperationBatch(operation.getType(), operation.getLockSet());
        } else if (!batch || !operationBatch.canBatchOperation(operation)) {
            this.runCurrentOperationBatch();
            operationBatch = this.factoryOperationBatch(operation.getType(), operation.getLockSet());
        }

        if (batch) {
            operationBatch.addOperation(operation);
            this.delayRunOperationBatch();
        } else {
            this.runOperationBatch(operationBatch);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearRunComplete: function(event) {
        var operationBatchRunner = event.getTarget();
        this.cleanupRun(operationBatchRunner);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
OperationProcessor.EventTypes = {
    NO_MORE_OPERATIONS: "OperationProcessor:NoMoreOperations"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugatomic.OperationProcessor', OperationProcessor);
