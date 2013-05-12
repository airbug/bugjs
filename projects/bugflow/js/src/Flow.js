//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('Flow')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');
var BugTrace =  bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $error = BugTrace.$error;
var $trace = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Flow = Class.extend(Obj, {

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
         * @type {function(Error)}
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
        this.errored = false;

        /**
         * @private
         * @type {boolean}
         */
        this.executed = false;
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
    hasExecuted: function() {
        return this.executed;
    },

    /**
     * @return {boolean}
     */
    hasErrored: function() {
        return this.errored;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Error} error
     * @param {...*} var_args
     */
    complete: function(error) {
        var _this = this;
        if (error) {
            this.error(error);
        } else {
            var args = arguments;
            if (this.hasErrored()) {
                throw new Error("Cannot complete flow. Flow has already errored out.");
            }
            if (this.hasCompleted()) {
                throw new Error("Can only complete a flow once.");
            }
            _this.completeFlow(args);
        }
    },

    /**
     * @param {Error} error
     */
    error: function(error) {
        if (this.hasErrored()) {
            throw new Error("Can only error flow once.");
        }
        if (this.hasCompleted()) {
            throw new Error("Cannot error flow. Flow has already completed.");
        }
        this.errorFlow($error(error));
    },

    /**
     * @param {Array<*>} args
     * @param {function(Error)} callback
     */
    execute: function(args, callback) {
        if (TypeUtil.isFunction(args)) {
            callback = args;
            args = [];
        }
        this.callback = callback;
        if (!this.executed) {
            try {
                this.executeFlow(args);
            } catch(error) {
                this.error(error);
            }
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
    completeFlow: function(args) {
        var _this = this;
        this.completed = true;
        if (this.callback) {
            setTimeout($trace(function() {
                _this.callback.apply(this, args);
            }), 0);
        }
    },

    /**
     * @protected
     * @param {Error} error
     */
    errorFlow: function(error) {
        this.errored = true;
        if (this.callback) {
            this.callback(error);
        } else {
            throw error;
        }
    },

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this.executed = true;
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.Flow', Flow);
