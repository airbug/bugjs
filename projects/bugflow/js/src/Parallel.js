//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Parallel')

//@Require('Class')
//@Require('Flow')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Flow = bugpack.require('Flow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Parallel = Class.extend(Flow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(flowArray) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<Flow>}
         */
        this.flowArray = flowArray;

        /**
         * @private
         * @type {number}
         */
        this.numberComplete = 0;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        var _this = this;
        if (this.flowArray.length > 0) {
            this.flowArray.forEach(function(flow) {
                flow.execute(args, function(error) {
                    _this.flowCallback(error);
                });
            });
        } else {
            this.complete();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Error} error
     */
    flowCallback: function(error) {
        if (error) {
            this.error(error);
        } else {
            this.numberComplete++;
            if (this.numberComplete >= this.flowArray.length) {
                this.complete();
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Parallel);
