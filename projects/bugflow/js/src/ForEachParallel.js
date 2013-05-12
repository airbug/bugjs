//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('ForEachParallel')

//@Require('Class')
//@Require('bugflow.Iteration')
//@Require('bugflow.IteratorFlow')
//@Require('bugtrace.BugTrace')


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
var BugTrace =      bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $error = BugTrace.$error;
var $trace = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ForEachParallel = Class.extend(IteratorFlow, {

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
         * @type {number}
         */
        this.numberIterationsComplete = 0;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this._super(args);
        var _this = this;
        if (this.getData().length > 0) {
            this.getData().forEach(function(value, index) {
                _this.executeIteration([value, index]);
            });
        } else {
            this.complete();
        }
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
            if (this.numberIterationsComplete >= this.getData().length && !this.hasErrored()) {
                this.complete();
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.ForEachParallel', ForEachParallel);
