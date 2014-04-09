//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugatomic.OperationBatch')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('List')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var List            = bugpack.require('List');
var Set             = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var OperationBatch = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {Array.<string>} locks
     */
    _constructor: function(type, locks) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<string>}
         */
        this.lockSet        = new Set(locks);

        /**
         * @private
         * @type {List.<Operation>}
         */
        this.operationList  = new List();

        /**
         * @private
         * @type {string}
         */
        this.type           = type;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<string>}
     */
    getLockSet: function() {
        return this.lockSet;
    },

    /**
     * @return {List.<Operation>}
     */
    getOperationList: function() {
        return this.operationList;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Operation} operation
     * @return {boolean}
     */
    canBatchOperation: function(operation) {
        return (this.lockSet.containsEqual(operation.getLockSet()) && this.type === operation.getType());
    },

    /**
     * @param {Operation} operation
     */
    addOperation: function(operation) {
        this.operationList.add(operation);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugatomic.OperationBatch', OperationBatch);
