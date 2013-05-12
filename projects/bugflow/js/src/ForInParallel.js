//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('ForInParallel')

//@Require('Class')
//@Require('bugflow.Iteration')
//@Require('bugflow.IteratorFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var Iteration =     bugpack.require('bugflow.Iteration');
var IteratorFlow =  bugpack.require('bugflow.IteratorFlow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ForInParallel = Class.extend(IteratorFlow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data, iteratorMethod) {

        this._super(data, iteratorMethod);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // TODO BRN: Add support for BugJs data objects that implement the IIterate interface

        /**
         * @private
         * @type {boolean}
         */
        this.iterationCompleted = false;

        /**
         * @private
         * @type {number}
         */
        this.numberIterationsComplete = 0;

        /**
         * @private
         * @type {number}
         */
        this.totalIterationCount = 0;
    },


    //-------------------------------------------------------------------------------
    // IteratorFlow Extensions
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this._super(args);
        for (var key in this.data) {
            this.totalIterationCount++;
            var value = this.data[key];
            this.executeIteration([key, value]);
        }
        this.iterationCompleted = true;
        this.checkIterationComplete();
    },


    //-------------------------------------------------------------------------------
    // IteratorFlow Extensions
    //-------------------------------------------------------------------------------

    /**
     *
     * @param args
     */
    executeIteration: function(args) {
        var _this = this;
        var iteration = new Iteration(this.getIteratorMethod());
        iteration.execute(args, function(error) {
            _this.iterationCallback(error);
        })
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    checkIterationComplete: function() {
        if (this.iterationCompleted && this.numberIterationsComplete >= this.totalIterationCount && !this.hasErrored()) {
            this.completeFlow();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Error} error
     */
    iterationCallback: function(error) {

        //TODO BRN: Figure out what to do if there is more than one error

        if (error) {
            if (!this.hasErrored()) {
                this.error(error);
            }
        } else {
            this.numberIterationsComplete++;
            this.checkIterationComplete();
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.ForInParallel', ForInParallel);
