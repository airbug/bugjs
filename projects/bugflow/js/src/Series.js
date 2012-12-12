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

    _constructor: function(flowArray) {

        this._super();


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
         * @type {number}
         */
        this.index = -1;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this.execArgs = args;
        this.startNextFlow();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Flow} flow
     */
    addFlowListeners: function(flow) {
        flow.addEventListener(Flow.EventType.COMPLETE, this.handleFlowComplete, this);
        flow.addEventListener(Flow.EventType.EXIT, this.handleFlowExit, this);
        flow.addEventListener(Flow.EventType.ERROR, this.handleFlowError, this);
    },

    /**
     * @private
     * @param {Flow} flow
     */
    removeFlowListeners: function(flow) {
        flow.removeEventListener(Flow.EventType.COMPLETE, this.handleFlowComplete, this);
        flow.removeEventListener(Flow.EventType.EXIT, this.handleFlowExit, this);
        flow.removeEventListener(Flow.EventType.ERROR, this.handleFlowError, this);
    },

    /**
     * @private
     */
    startNextFlow: function() {
        this.index++;
        if (this.index < this.flowArray.length) {
            var nextFlow = this.flowArray[this.index];
            this.addFlowListeners(nextFlow);
            nextFlow.execute(this.execArgs);
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
        var flow = event.getTarget();
        this.removeFlowListeners(flow);
        this.numberComplete++;
        this.startNextFlow();
    },

    /**
     * @private
     * @param {Event} event
     */
    handleFlowExit: function(event) {
        var flow = event.getTarget();
        this.removeFlowListeners(flow);

        //NOTE BRN: Matching break logic here. Only "exiting" out of one layer of iteration.

        this.complete();
    },

    /**
     * @private
     * @param {Event} event
     */
    handleFlowError: function(event) {
        var flow = event.getTarget();
        this.removeFlowListeners(flow);
        this.error(event.getData().error);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Series);
