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

bugpack.declare('Parallel');

var Class = bugpack.require('Class');
var Flow = bugpack.require('Flow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Parallel = Class.extend(Flow, {

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
         * @type {Array<Flow>}
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
        this.numberComplete = 0;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {...*} var_args
     */
    executeFlow: function() {
        var _this = this;
        this.execArgs = arguments;
        this.flowArray.forEach(function(flow) {
            flow.addEventListener(Flow.EventType.COMPLETE, _this.handleFlowComplete, _this);
            flow.execute.apply(flow, _this.execArgs);
        });
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleFlowComplete: function(event) {
        var flow = event.getTarget();
        flow.removeEventListener(Flow.EventType.COMPLETE, this.handleFlowComplete, this);
        this.numberComplete++;
        if (this.numberComplete >= this.flowArray.length) {
            this.complete();
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Parallel);
