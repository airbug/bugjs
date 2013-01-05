//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('ForEachSeries')

//@Require('Class')
//@Require('Flow')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Boil = bugpack.require('Boil');
var Class = bugpack.require('Class');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ForEachSeries = Class.extend(Boil, {

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
         * @type {function(Boil, *)}
         */
        this.iteratorMethod = iteratorMethod;

        /**
         * @private
         * @type {number}
         */
        this.iteratorIndex = -1;
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
            this.next();
        }
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this.next();
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    next: function() {
        this.iteratorIndex++;
        if (!this.data) {
            this.error("data value must be iterable");
        }
        if (this.iteratorIndex >= this.data.length) {
            this.complete();
        } else {
            var nextValue = this.data[this.iteratorIndex];
            this.iteratorMethod.call(null, this, nextValue);
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(ForEachSeries);
