//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArgumentBug')

//@Require('Bug')
//@Require('Class')
//@Require('StackTraceUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug             = bugpack.require('Bug');
var Class           = bugpack.require('Class');
var StackTraceUtil  = bugpack.require('StackTraceUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ArgumentBug = Class.extend(Bug, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(type, argName, argValue, message, causes) {

        this._super(type, {}, message, causes);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.argName    = argName;

        /**
         * @private
         * @type {*}
         */
        this.argValue   = argValue;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getArgName: function() {
        return this.argName;
    },

    /**
     * @return {string}
     */
    getArgValue: function() {
        return this.argValue;
    },


    //-------------------------------------------------------------------------------
    // Throwable Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @returns {string}
     */
    generateStackTrace: function() {
        return this.getMessage() + "\n" +
            "Argument '" + this.argName + "' was " + this.argValue + "\n" +
            StackTraceUtil.generateStackTrace();
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @const {string}
 */
ArgumentBug.ILLEGAL = "ArgumentBug:Illegal";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ArgumentBug', ArgumentBug);
