/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugatomic.OperationBatchRunner')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('bugatomic.Operation')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var OperationBatchRunner = Class.extend(EventDispatcher, {

        _name: "bugatomic.OperationBatchRunner",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
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
        // Public Methods
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
        // Private Methods
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
});
