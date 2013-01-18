//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugboil')

//@Export('ForEachParallel')

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

var ForEachParallel = Class.extend(Boil, {

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
        this.numberIterationsComplete = 0;
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
            if (this.numberIterationsComplete >= this.getData().length && !this.hasErrored()) {
                this.complete()
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        var _this = this;
        if (this.data.length > 0) {
            this.data.forEach(function(value, index) {
                _this.iteratorMethod.call(null, _this, value, index);
            });
        } else {
            this.complete();
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugboil.ForEachParallel', ForEachParallel);
