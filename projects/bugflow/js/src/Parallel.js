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
                _this.addFlowListeners(flow);
                flow.execute(args);
            });
        } else {
            this.complete();
        }
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
        if (this.numberComplete >= this.flowArray.length) {
            this.complete();
        }
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

bugpack.export(Parallel);
