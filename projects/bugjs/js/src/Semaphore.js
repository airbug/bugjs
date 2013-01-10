//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Semaphore')

//@Require('Class')
//@Require('Obj')
//@Require('Queue')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');
var Queue = bugpack.require('Queue');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Semaphore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(numberPermits) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Queue.<function()>}
         */
        this.acquisitionQueue = new Queue();

        /**
         * @private
         * @type {number}
         */
        this.numberPermitsAcquired = 0;

        /**
         * @private
         * @type {number}
         */
        this.numberPermits = numberPermits;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function()} method
     */
    acquire: function(method) {

        // NOTE BRN: This check speeds up the code a bit by allowing us to avoid hitting the queue when the queue is
        // empty.

        if (this.numberPermitsAcquired < this.numberPermits && this.acquisitionQueue.getCount() === 0) {
            this.acquirePermit(method);
        } else {
            this.queueAcquisition(method);
        }
    },

    /**
     *
     */
    release: function() {
        this.releasePermit();
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    acquirePermit: function(method) {
        this.numberPermitsAcquired++;
        method();
    },

    /**
     * @private
     */
    processQueue: function() {
        var _this = this;

        // NOTE BRN: We use a setTimeout here to help prevent stack overflows when it comes to the processing of the
        // queue.

        setTimeout(function() {
            while (_this.numberPermitsAcquired < _this.numberPermits && _this.acquisitionQueue.getCount() > 0) {
                var nextMethod = _this.acquisitionQueue.dequeue();
                _this.acquirePermit(nextMethod);
            }
        }, 0);
    },

    /**
     * @private
     * @param {function()} method
     */
    queueAcquisition: function(method) {
        this.acquisitionQueue.enqueue(method);
        this.processQueue();
    },

    /**
     * @private
     */
    releasePermit: function() {
        this.numberPermitsAcquired--;
        this.processQueue();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(Semaphore);
