//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcli')

//@Export('CliParser')

//@Require('Class')
//@Require('Obj')
//@Require('bugcli.CliAction')
//@Require('bugcli.CliActionInstance')
//@Require('bugcli.CliOption')
//@Require('bugcli.CliOptionInstance')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Obj =               bugpack.require('Obj');
var CliAction =         bugpack.require('bugcli.CliAction');
var CliActionInstance = bugpack.require('bugcli.CliActionInstance');
var CliOption =         bugpack.require('bugcli.CliOption');
var CliOptionInstance = bugpack.require('bugcli.CliOptionInstance');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CliParser = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cli) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCli}
         */
        this.cli = cli;

        /**
         * @private
         * @type {number}
         */
        this.index = 0;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<string>} argv
     * @param {CliBuild} cliBuild
     * @param {function(Error)} callback
     */
    parse: function(argv, cliBuild, callback) {
        this.index = 1;
        var error = null;
        while (this.hasNextArg(argv)) {
            var flag = this.nextArg(argv);
            if (this.cli.containsCliFlag(flag)) {
                var cliFlag = this.cli.getCliFlag(flag);
                if (Class.doesExtend(cliFlag, CliAction)) {
                    if (!cliBuild.hasCliActionInstance()) {
                        this.parseCliActionInstance(argv, cliBuild, cliFlag, flag);
                    } else {
                        error = new Error("Duplicate action '" + flag + "' found. Can only specify one action.")
                    }
                } else if (Class.doesExtend(cliFlag, CliOption)) {
                    this.parseCliOptionInstance(argv, cliBuild, cliFlag, flag);
                } else {
                    error = new Error("cli flag is an unknown type. This should not happen.");
                }
            } else {
                error = new Error("unknown parameter '" + flag + "'");
            }
        }
        callback(error);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Array.<string>} argv
     * @return {*}
     */
    currentArg: function(argv) {
        return argv[this.index];
    },

    /**
     * @private
     * @param {Array.<string>} argv
     * @return {boolean}
     */
    hasNextArg: function(argv) {
        return (this.index < (argv.length - 1));
    },

    /**
     * @private
     * @param {Array.<string>} argv
     * @return {*}
     */
    nextArg: function(argv) {
        this.index++;
        //TEST
        console.log("next arg called - this.index:", this.index, " argv[this.index]:", argv[this.index]);

        return argv[this.index];
    },

    /**
     * @private
     * @param {Array.<string>} argv
     * @return {*}
     */
    peekArg: function(argv) {
        return argv[this.index + 1];
    },

    /**
     * @private
     * @param {Array.<string>} argv
     * @param {CliBuild} cliBuild
     * @param {CliAction} cliAction
     * @param {string} flag
     */
    parseCliActionInstance: function(argv, cliBuild, cliAction, flag) {
        var _this = this;
        var cliActionInstance = new CliActionInstance(cliAction);
        if (cliBuild.hasCliActionInstance()) {
            throw new Error("Duplicate action found '" + flag + "'")
        }
        cliBuild.setCliActionInstance(cliActionInstance);
        if (cliAction.hasParameters()) {
            var cliParameterList = cliAction.getCliParameterList();
            for (var i = 0, size = cliParameterList.getCount(); i < size; i++) {
                var cliParameter = cliParameterList.getAt(i);
                var nextArg = _this.nextArg(argv);
                if (_this.cli.containsCliFlag(nextArg)) {
                    var cliFlag = _this.cli.getCliFlag(nextArg);
                    if (Class.doesExtend(cliFlag, CliAction)) {
                        throw new Error("Expecting action parameter. Instead found next action '" + nextArg + "'");
                    } else if (Class.doesExtend(cliFlag, CliOption)) {
                        _this.parseCliOptionInstance(argv, cliBuild, cliFlag, nextArg);
                        nextArg = _this.nextArg(argv);
                    } else {
                        throw new Error("cli flag is an unknown type. This should not happen.");
                    }
                }
                cliActionInstance.addCliParameterInstance(cliParameter.getName(), nextArg);
            }
        }
    },

    /**
     * @private
     * @param {Array.<string>} argv
     * @param {CliBuild} cliBuild
     * @param {CliOption} cliOption
     * @param {string} flag
     */
    parseCliOptionInstance: function(argv, cliBuild, cliOption, flag) {
        var _this = this;
        var cliOptionInstance = new CliOptionInstance(cliOption);
        if (cliBuild.hasCliOptionInstance(cliOptionInstance)) {
            throw new Error("Duplicate option found '" + flag + "'")
        }
        cliBuild.addCliOptionInstance(cliOptionInstance);
        if (cliOption.hasParameters()) {
            var cliParameterList = cliOption.getCliParameterList();
            for (var i = 0, size = cliParameterList.getCount(); i < size; i++) {
                var cliParameter = cliParameterList.getAt(i);
                var nextArg = _this.nextArg(argv);
                if (_this.cli.containsCliFlag(nextArg)) {
                    var cliFlag = _this.cli.getCliFlag(nextArg);
                    if (Class.doesExtend(cliFlag, CliAction)) {
                        throw new Error("Expecting option parameter. Instead found an action '" + nextArg + "'");
                    } else if (Class.doesExtend(cliFlag, CliOption)) {
                        throw new Error("Expecting option parameter. Instead found an option '" + nextArg + "'");
                    } else {
                        throw new Error("cli flag is an unknown type. This should not happen.");
                    }
                }
                cliOptionInstance.addCliParameterInstance(cliParameter.getName(), nextArg);
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliParser', CliParser);
