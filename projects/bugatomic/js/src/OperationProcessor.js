//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugatomic')

//@Export('OperationProcessor')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Queue')
//@Require('Set')
//@Require('bugatomic.Operation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var Queue           = bugpack.require('Queue');
var Set             = bugpack.require('Set');
var Operation       = bugpack.require('bugatomic.Operation');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

var OperationProcessor = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(key, numberLocks) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.key = key;

        /**
         * @private
         * @type {number}
         */
        this.numberLocks = numberLocks;

        /**
         * @private
         * @type {number}
         */
        this.numberLocksAcquired = 0;

        /**
         * @private
         * @type {Queue.<Operation>}
         */
        this.operationQueue = new Queue();

        /**
         * @private
         * @type {Set.<Operation>}
         */
        this.pendingOperationSet = new Set();
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
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Operation} operation
     */
    process: function(operation) {
        this.queueOperation(operation);
        this.processQueue();
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    acquireLock: function() {
        this.numberLocksAcquired++;
    },

    /**
     * @private
     * @param {Operation} operation
     */
    completeOperation: function(operation) {
        if (operation.isLocking()) {
            this.releaseLock();
            this.processQueue();
        }
        this.pendingOperationSet.remove(operation);
        if (this.pendingOperationSet.isEmpty() && this.operationQueue.isEmpty()) {
            this.noMoreOperations();
        }
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
    processQueue: function() {
        while (this.numberLocksAcquired < this.numberLocks && !this.operationQueue.isEmpty()) {
            var operation = this.operationQueue.dequeue();
            this.runOperation(operation);
        }
    },

    /**
     * @private
     * @param {Operation} operation
     */
    queueOperation: function(operation) {
        this.operationQueue.enqueue(operation);
    },

    /**
     * @private
     */
    releaseLock: function() {
        this.numberLocksAcquired--;
    },

    /**
     * @private
     * @param {Operation} operation
     */
    runOperation: function(operation) {
        operation.on(Operation.EventTypes.COMPLETE, this.hearOperationComplete, this);
        if (operation.isLocking()) {
            this.acquireLock();
        }
        this.pendingOperationSet.add(operation);
        operation.run();
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
OperationProcessor.EventTypes = {
    NO_MORE_OPERATIONS: "OperationProcessor:NoMoreOperations"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugatomic.OperationProcessor', OperationProcessor);
