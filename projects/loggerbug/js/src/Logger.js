//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('loggerbug')

//@Export('Logger')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var Logger = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {number} consoleLogPriority
     */
    _constructor: function(consoleLogPriority) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this.consoleLogPriority     = consoleLogPriority || Logger.Priority.WARN;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {number}
     */
    getConsoleLogPriority: function() {
        return this.consoleLogPriority;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {...string} message
     */
    debug: function(message) {
        var messages = ArgUtil.toArray(arguments);
        this.processLog(Logger.Type.DEBUG, Logger.Priority.DEBUG, messages);
    },

    /**
     * @param {...string} message
     */
    error: function(message) {
        var messages = ArgUtil.toArray(arguments);
        this.processLog(Logger.Type.ERROR, Logger.Priority.ERROR, messages);
    },

    /**
     * @param {...string} message
     */
    info: function(message) {
        var messages = ArgUtil.toArray(arguments);
        this.processLog(Logger.Type.INFO, Logger.Priority.INFO, messages);
    },

    /**
     * @param {string} type
     * @param {number} priority
     * @param {...string} message
     */
    log: function(type, priority, message) {
        var messages = ArgUtil.toArray(arguments);
        messages.shift();
        messages.shift();
        this.processLog(type, priority, message);
    },

    /**
     * @param {...string} message
     */
    trace: function(message) {
        var messages = ArgUtil.toArray(arguments);
        this.processLog(Logger.Type.TRACE, Logger.Priority.TRACE, messages);
    },

    /**
     * @param {...string} message
     */
    warn: function(message) {
        var messages = ArgUtil.toArray(arguments);
        this.processLog(Logger.Type.WARN, Logger.Priority.WARN, messages);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} type
     * @param {number} priority
     * @param {Array.<string>} messages
     */
    processLog: function(type, priority, messages) {
        if (priority >= this.consoleLogPriority) {
            console.log.apply(console, messages);
        }
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
Logger.Type = {
    DEBUG: "Level:Debug",
    ERROR: "Level:Error",
    INFO: "Level:Info",
    TRACE: "Level:Trace",
    WARN: "Level:Warn"
};

/**
 * @static
 * @enum {number}
 */
Logger.Priority = {
    DEBUG: 200,
    ERROR: 500,
    INFO: 300,
    TRACE: 100,
    WARN: 400
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('loggerbug.Logger', Logger);
