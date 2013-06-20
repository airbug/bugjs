//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('ForEachSeries')

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

var ForEachSeries = Class.extend(IteratorFlow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data, iteratorMethod) {

        this._super(data, iteratorMethod);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        if (Class.doesImplement(data, IIterable)) {
            throw new Error("ForEachSeries does not support IIterable instances. Use the IterableSeries instead.");
        }
        /**
         * @private
         * @type {number}
         */
        this.iteratorIndex = -1;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        if (!this.data) {
            this.error("data value must be iterable");
        }
        if (this.data.length > 0) {
            this.next();
        } else {
            this.complete();
        }
    },


    //-------------------------------------------------------------------------------
    // IteratorFlow Extensions
    //-------------------------------------------------------------------------------

    /**
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
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    next: function() {
        this.iteratorIndex++;
        var nextValue = this.data[this.iteratorIndex];
        this.executeIteration([nextValue, this.iteratorIndex]);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Error} error
     */
    iterationCallback: function(error) {
        if (error) {
            if (!this.hasErrored()) {
                this.error(error);
            }
        } else {
            if (this.iteratorIndex >= (this.data.length - 1)) {
                this.complete();
            } else {
                this.next();
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.ForEachSeries', ForEachSeries);
