//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.BugCli')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugcli.CliAction')
//@Require('bugcli.CliBuild')
//@Require('bugcli.CliOption')
//@Require('bugcli.CliParser')
//@Require('bugcli.CliRunner')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();
var path                = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var CliAction           = bugpack.require('bugcli.CliAction');
var CliBuild            = bugpack.require('bugcli.CliBuild');
var CliOption           = bugpack.require('bugcli.CliOption');
var CliParser           = bugpack.require('bugcli.CliParser');
var CliRunner           = bugpack.require('bugcli.CliRunner');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var BugCli = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CliParser}
         */
        this.cliParser = null;

        /**
         * @private
         * @type {CliAction}
         */
        this.defaultCliAction = null;

        /**
         * @private
         * @type {Map.<string, CliFlag>}
         */
        this.flagToCliFlagMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CliAction}
     */
    getDefaultCliAction: function() {
        return this.defaultCliAction;
    },

    /**
     * @return {boolean}
     */
    hasDefaultCliAction: function() {
        return !!(this.defaultCliAction);
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    configure: function(callback) {
        this.cliParser = new CliParser(this);
        callback();
    },

    /**
     * @param {string} flagName
     * @return {boolean}
     */
    containsCliFlag: function(flagName) {
        return this.flagToCliFlagMap.containsKey(flagName);
    },

    /**
     * @param {string} flagName
     * @return {CliFlag}
     */
    getCliFlag: function(flagName) {
        return this.flagToCliFlagMap.get(flagName);
    },

    /**
     *
     */
    run: function(argv, callback) {
        var _this = this;
        var cliBuild = new CliBuild();
        var cliRunner = new CliRunner(this, cliBuild);
        $series([
            $task(function(flow) {
                _this.cliParser.parse(argv, cliBuild, function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                cliRunner.run(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Object} cliActionObject
     */
    registerCliAction: function(cliActionObject) {
        var _this = this;

        //TODO BRN: We should replace this with the BugMarshaller

        var cliAction = new CliAction(cliActionObject);
        cliAction.getFlagSet().forEach(function(flag) {
            _this.flagToCliFlagMap.put(flag, cliAction);
        });
        if (cliAction.getDefault()) {
            if (!this.hasDefaultCliAction()) {
                this.defaultCliAction = cliAction;
            } else {
                throw new Error("Can only specify one cliAction default. Found a second '" + cliAction.getName() + "'")
            }
        }
    },

    /**
     * @protected
     * @param {Object} cliOptionObject
     */
    registerCliOption: function(cliOptionObject) {
        var _this = this;

        //TODO BRN: We should replace this with the BugMarshaller

        var cliOption = new CliOption(cliOptionObject);
        cliOption.getFlagSet().forEach(function(flag) {
            _this.flagToCliFlagMap.put(flag, cliOption);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.BugCli', BugCli);
