//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('Flow')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('Flow');

var Class = bugpack.require('Class');
var Event = bugpack.require('Event');
var EventDispatcher = bugpack.require('EventDispatcher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Flow = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callback) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function()}
         */
        this.callback = callback;

        /**
         * @privte
         * @type {boolean}
         */
        this.completed = false;

        /**
         * @private
         * @type {boolean}
         */
        this.executed = false;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    complete: function() {
        if (!this.completed) {
            this.completed = true;
            this.completeFlow();
        } else {
            throw new Error("Can only complete a flow once.");
        }
    },

    /**
     * @param {...*} var_args
     */
    execute: function() {
        if (!this.executed) {
            this.executed = true;
            this.executeFlow.apply(this, arguments);
        } else {
            throw new Error("A flow can only be executed once.");
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    completeFlow: function() {
        if (this.callback) {
            this.callback();
        }
        this.dispatchEvent(new Event(Flow.EventType.COMPLETE));
    },

    /**
     * @abstract
     * @param {...*} var_args
     */
    executeFlow: function() {
        // abstract
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Flow.EventType = {
    COMPLETE: "Task:Complete"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Flow);
