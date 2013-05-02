//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugboil')

//@Export('ForInParallel')

//@Require('Class')
//@Require('bugboil.Boil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Boil = bugpack.require('bugboil.Boil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ForInParallel = Class.extend(Boil, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data, iteratorMethod) {

        this._super(data);


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
         * @type {function(Boil, *, *)}
         */
        this.iteratorMethod = iteratorMethod;

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
    // Boil Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Error} error
     */
    bubble: function(error) {
        if (error) {
            if (!this.hasErrored()) {
                this.error(error);
            }
        } else {
            this.numberIterationsComplete++;
            this.checkIterationComplete();
        }
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        for (var key in this.data) {
            this.totalIterationCount++;
            var value = this.data[key];
            this.iteratorMethod.call(null, this, key, value);
        }
        this.iterationCompleted = true;
        this.checkIterationComplete();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    checkIterationComplete: function() {
        if (this.iterationCompleted && this.numberIterationsComplete >= this.totalIterationCount && !this.hasErrored()) {
            this.complete();
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugboil.ForInParallel', ForInParallel);
