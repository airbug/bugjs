//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('IterableSeries')

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

var IterableSeries = Class.extend(IteratorFlow, {

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
            throw new Error("IterableSeries only supports IIterable instances.");
        }

        /**
         * @private
         * @type {IIterator}
         */
        this.iterator = data.iterator();
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
        if (this.iterator.hasNext()) {
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
        var nextValue = this.iterator.next();
        this.executeIteration([nextValue]);
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
            if (!this.iterator.hasNext()) {
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

bugpack.export('bugflow.IterableSeries', IterableSeries);
