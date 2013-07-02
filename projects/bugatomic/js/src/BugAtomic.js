//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugatomic')

//@Export('BugAtomic')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugatomic.Operation')
//@Require('bugatomic.OperationProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


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

var BugAtomic = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(numberLocks) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, OperationProcessor>}
         */
        this.keyToOperationProcessorMap = new Map();

        /**
         * @private
         * @type {number}
         */
        this.numberLocks = numberLocks;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {boolean} locking
     * @param {function(Operation)} operationMethod
     */
    operation: function(key, locking, operationMethod) {
        var operation = new Operation(locking, operationMethod);
        var operationProcessor = this.keyToOperationProcessorMap.get(key);
        if (!operationProcessor) {
            operationProcessor = this.factoryOperationProcessor(key);
        }
        operationProcessor.process(operation);
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} key
     * @return {OperationProcessor}
     */
    factoryOperationProcessor: function(key) {
        var operationProcessor = new OperationProcessor(key, this.numberLocks);
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
