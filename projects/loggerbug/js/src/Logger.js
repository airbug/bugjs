//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('loggerbug')

//@Export('Logger')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Throwable')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil                         = bugpack.require('ArgUtil');
var Class                           = bugpack.require('Class');
var Map                             = bugpack.require('Map');
var Obj                             = bugpack.require('Obj');
var Throwable                       = bugpack.require('Throwable');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


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
     * @param {console|Console} console
     * @param {number} consoleLogPriority
     */
    _constructor: function(console, consoleLogPriority) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {console|Console}
         */
        this.console                = console;

        /**
         * @private
         * @type {number}
         */
        this.consoleLogPriority     = consoleLogPriority || Logger.Priority.INFO;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {console|Console}
     */
    getConsole: function() {
        return this.console;
    },

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
        var _this = this;
        if (priority >= this.consoleLogPriority) {
            if (type === Logger.Type.ERROR) {
                messages.forEach(function(message) {
                    if (Class.doesExtend(message, Throwable) || Class.doesExtend(message, Error)) {
                        _this.console.error(message.message + "\n" + message.stack);
                    } else {
                        _this.console.error(message);
                    }
                });
            } else if (type === Logger.Type.WARN) {
                messages.forEach(function(message) {
                    if (Class.doesExtend(message, Throwable) || Class.doesExtend(message, Error)) {
                        _this.console.error(message.message + "\n" + message.stack);
                    } else {
                        _this.console.error(message);
                    }
                });
            } else {
                messages.forEach(function(message) {
                    if (Class.doesExtend(message, Throwable) || Class.doesExtend(message, Error)) {
                        _this.console.log(message.message + "\n" + message.stack);
                    } else {
                        _this.console.log(message);
                    }
                });
            }
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Logger).with(
    module("logger")
        .args([
            arg().ref("console")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('loggerbug.Logger', Logger);
