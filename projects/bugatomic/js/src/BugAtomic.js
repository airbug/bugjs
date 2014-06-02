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

//@Export('bugatomic.BugAtomic')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugatomic.Operation')
//@Require('bugatomic.OperationProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var Operation           = bugpack.require('bugatomic.Operation');
    var OperationProcessor  = bugpack.require('bugatomic.OperationProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BugAtomic = Class.extend(Obj, {

        _name: "bugatomic.BugAtomic",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ILockOperator} lockOperator
         */
        _constructor: function(lockOperator) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, OperationProcessor>}
             */
            this.keyToOperationProcessorMap = new Map();

            /**
             * @private
             * @type {ILockOperator}
             */
            this.lockOperator               = lockOperator;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} key
         * @param {string} type
         * @param {(Array.<string> | Collection.<string>)} locks
         * @param {boolean} batch
         * @param {function(Operation)} method
         */
        operation: function(key, type, locks, batch, method) {
            var operation = new Operation(type, locks, method);
            var operationProcessor = this.keyToOperationProcessorMap.get(key);
            if (!operationProcessor) {
                operationProcessor = this.factoryOperationProcessor(key);
            }
            operationProcessor.process(operation, batch);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} key
         * @return {OperationProcessor}
         */
        factoryOperationProcessor: function(key) {
            var operationProcessor = new OperationProcessor(key, this.lockOperator);
            this.keyToOperationProcessorMap.put(key, operationProcessor);
            operationProcessor.on(OperationProcessor.EventTypes.NO_MORE_OPERATIONS, this.hearNoMoreOperations, this);
            return operationProcessor;
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearNoMoreOperations: function(event) {
            var operationProcessor = event.getTarget();
            this.keyToOperationProcessorMap.remove(operationProcessor.getKey());
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugatomic.BugAtomic', BugAtomic);
});
