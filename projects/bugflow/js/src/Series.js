//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Series')

//@Require('Class')
//@Require('Flow')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('Series');

var Class = bugpack.require('Class');
var Flow = bugpack.require('Flow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Series = Class.extend(Flow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(flowArray, callback) {

        this._super(callback);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<*>}
         */
        this.execArgs = null;

        /**
         * @private
         * @type {*}
         */
        this.flowArray = flowArray;

        /**
         * @private
         * @type {*}
         */
        this.callback = callback;

        /**
         * @private
         * @type {number}
         */
        this.index = -1;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {...*} var_args
     */
    executeFlow: function() {
        this.execArgs = arguments;
        this.startNextFlow();
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    startNextFlow: function() {
        this.index++;
        if (this.index < this.flowArray.length) {
            var nextFlow = this.flowArray[this.index];
            nextFlow.addEventListener(Flow.EventType.COMPLETE, this.handleFlowComplete, this);
            nextFlow.execute.apply(nextFlow, this.execArgs);
        } else {
            this.complete();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleFlowComplete: function(event) {
        this.startNextFlow();
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Series);
