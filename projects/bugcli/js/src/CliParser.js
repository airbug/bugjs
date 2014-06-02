/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliParser')

//@Require('Class')
//@Require('Obj')
//@Require('bugcli.CliAction')
//@Require('bugcli.CliActionInstance')
//@Require('bugcli.CliOption')
//@Require('bugcli.CliOptionInstance')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var CliAction           = bugpack.require('bugcli.CliAction');
    var CliActionInstance   = bugpack.require('bugcli.CliActionInstance');
    var CliOption           = bugpack.require('bugcli.CliOption');
    var CliOptionInstance   = bugpack.require('bugcli.CliOptionInstance');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliParser = Class.extend(Obj, {

        _name: "bugcli.CliParser",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {BugCli} cli
         */
        _constructor: function(cli) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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

        /**
         * @return {number}
         */
        getIndex: function() {
            return this.index;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<string>} argv
         * @param {CliBuild} cliBuild
         * @param {function(Error)} callback
         */
        parse: function(argv, cliBuild, callback) {
            this.index = 1;
            var error = null;
            var unknownParameters = [];
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
                    unknownParameters.push(flag);
                }
            }
            if (!error) {
                if (!cliBuild.hasCliActionInstance() && this.cli.hasDefaultCliAction()) {
                    this.parseDefaultCliActionInstance(unknownParameters, cliBuild);
                }

                if (unknownParameters.length > 0) {
                    error = new Error("unknown parameter '" + unknownParameters[0] + "'");
                }
            }
            callback(error);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
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
        },

        /**
         * @private
         * @param {Array.<string>} unknownParameters
         * @param {CliBuild} cliBuild
         */
        parseDefaultCliActionInstance: function(unknownParameters, cliBuild) {
            var defaultCliAction = this.cli.getDefaultCliAction();
            var cliActionInstance = new CliActionInstance(defaultCliAction);
            cliBuild.setCliActionInstance(cliActionInstance);
            if (defaultCliAction.hasParameters()) {
                var cliParameterList = defaultCliAction.getCliParameterList();
                for (var i = 0, size = cliParameterList.getCount(); i < size; i++) {
                    var cliParameter = cliParameterList.getAt(i);
                    var unknownArg = unknownParameters.shift();
                    cliActionInstance.addCliParameterInstance(cliParameter.getName(), unknownArg);
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliParser', CliParser);
});
