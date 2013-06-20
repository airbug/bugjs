//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('IterableParallel')

//@Require('Class')
//@Require('IIterable')
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

var Class           = bugpack.require('Class');
var IIterable       = bugpack.require('IIterable');
var Iteration       = bugpack.require('bugflow.Iteration');
var IteratorFlow    = bugpack.require('bugflow.IteratorFlow');
var BugTrace        = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $error = BugTrace.$error;
var $trace = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IterableParallel = Class.extend(IteratorFlow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {IIterable} data
     * @param {function(Flow, *)} iteratorMethod
     * @private
     */
    _constructor: function(data, iteratorMethod) {

        this._super(data, iteratorMethod);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        if (!Class.doesImplement(data, IIterable)) {
            throw new Error("IterableParallel only supports IIterable instances.");
        }

        /**
         * @private
         * @type {IIterable}
         */
        this.iterator = data.iterator();

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
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this._super(args);
        if (this.iterator.hasNext()) {
            while (this.iterator.hasNext()) {
                var value = this.iterator.next();
                this.totalIterationCount++;
                this.executeIteration([value]);
            }
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
            if (!this.iterator.hasNext() && this.numberIterationsComplete >= this.totalIterationCount && !this.hasErrored()) {
                this.completeFlow();
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.IterableParallel', IterableParallel);
