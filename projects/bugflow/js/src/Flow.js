//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugflow')

//@Export('Flow')


//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug         = bugpack.require('Bug');
var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');
var BugTrace    = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $error      = BugTrace.$error;
var $trace      = BugTrace.$trace;


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
        // Private Properties
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
     * @param {Throwable} throwable
     * @param {...*} var_args
     */
    complete: function(throwable) {
        var _this = this;
        if (throwable) {
            this.error(throwable);
        } else {
            var args = arguments;
            if (this.hasErrored()) {
                throw new Bug("DuplicateFlow", {}, "Cannot complete flow. Flow has already errored out.");
            }
            if (this.hasCompleted()) {
                throw new Bug("DuplicateFlow", {}, "Can only complete a flow once.");
            }
            _this.completeFlow(args);
        }
    },

    /**
     * @param {Throwable} throwable
     */
    error: function(throwable) {
        if (this.hasErrored()) {
            throw new Bug("DuplicateFlow", {}, "Can only error flow once.", [throwable]);
        }
        if (this.hasCompleted()) {
            throw new Bug("DuplicateFlow", {}, "Cannot error flow. Flow has already completed.", [throwable]);
        }
        this.errorFlow($error(throwable));
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
            //setTimeout($trace(function() {
                _this.callback.apply(this, args);
            //}), 0);
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
