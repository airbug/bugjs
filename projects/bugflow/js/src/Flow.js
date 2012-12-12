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

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function()}
         */
        this.callback = null;

        /**
         * @privte
         * @type {boolean}
         */
        this.completed = false;

        /**
         * @private
         * @type {boolean}
         */
        this.exited = false;

        /**
         * @private
         * @type {boolean}
         */
        this.errored = false;

        /**
         * @private
         * @type {boolean}
         */
        this.executed = false;

        /**
         * @private
         * @type {Error}
         */
        this.flowError = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasCompleted: function() {
        return this.completed;
    },

    /**
     * @return {boolean}
     */
    hasErrored: function() {
        return this.errored;
    },

    /**
     * @return {boolean}
     */
    hasExited: function() {
        return this.exited;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Error} error
     */
    complete: function(error) {
        var _this = this;
        if (error) {
            this.error(error);
        } else {
            if (this.hasErrored()) {
                throw new Error("Cannot complete flow. Flow has already errored out.");
            }
            if (this.hasExited()) {
                throw new Error("Cannot complete flow. Flow has already exited.");
            }
            if (this.hasCompleted()) {
                throw new Error("Can only complete a flow once.");
            }
            this.completed = true;
            setTimeout(function() {
                _this.completeFlow();
            }, 0);
        }
    },

    /**
     * @param {Error} error
     */
    exit: function(error) {
        if (error) {
            this.error(error);
        } else {
            if (this.hasErrored()) {
                throw new Error("Cannot exit flow. Flow has already errored out.");
            }
            if (this.hasExited()) {
                throw new Error("Can only exit a flow once.");
            }
            if (this.hasCompleted()) {
                throw new Error("Cannot exit flow. Flow has already completed.");
            }

            this.exited = true;
            this.exitFlow();
        }
    },

    /**
     * @param {Error} error
     */
    error: function(error) {
        if (this.hasErrored()) {
            throw new Error("Can only error flow once.");
        }
        if (this.hasExited()) {
            throw new Error("Cannot error flow. Flow has already exited.");
        }
        if (this.hasCompleted()) {
            throw new Error("Cannot error flow. Flow has already completed.");
        }
        this.errored = true;
        this.errorFlow(error);
    },

    /**
     * @param {Array<*>} args
     * @param {function(Error)} callback
     */
    execute: function(args, callback) {
        this.callback = callback;
        if (!this.executed) {
            this.executed = true;
            this.executeFlow(args);
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
     * @protected
     */
    exitFlow: function() {
        if (this.callback) {
            this.callback();
        }
        this.dispatchEvent(new Event(Flow.EventType.EXIT));
    },

    /**
     * @protected
     * @param {Error} error
     */
    errorFlow: function(error) {
        this.flowError = error;
        if (this.callback) {
            this.callback(error);
        }
        this.dispatchEvent(new Event(Flow.EventType.ERROR), {error: error});
    }

    /**
     * @abstract
     * @param {Array<*>} args
     */
    /*executeFlow: function(args) {
        // abstract
    }*/
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Flow.EventType = {
    COMPLETE: "Task:Complete",
    EXIT: "Task:Exit",
    ERROR: "Task:Error"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export(Flow);
