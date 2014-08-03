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

//@Export('bugcli.CliRunner')

//@Require('Class')
//@Require('Flows')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Flows       = bugpack.require('Flows');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series     = Flows.$series;
    var $task       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliRunner = Class.extend(Obj, {

        _name: "bugcli.CliRunner",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {BugCli} cli
         * @param {CliBuild} cliBuild
         */
        _constructor: function(cli, cliBuild) {

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
             * @type {CliBuild}
             */
            this.cliBuild = cliBuild;

            /**
             * @private
             * @type {boolean}
             */
            this.ran = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CliBuild}
         */
        getCliBuild: function() {
            return this.cliBuild;
        },

        /**
         * @return {boolean}
         */
        getRan: function() {
            return this.ran;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Error)} callback
         */
        run: function(callback) {
            var _this = this;
            if (!this.ran) {
                this.ran = true;
                $series([
                    $task(function(flow) {
                        _this.validate(function(error) {
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow) {
                        _this.initialize(function(error) {
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow) {
                        _this.executeCliAction(function(error) {
                            flow.complete(error);
                        })
                    })
                ]).execute(callback);
            } else {
                callback(new Error("CliRunner should only be run once"));
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Error=)} callback
         */
        initialize: function(callback) {
            callback();
        },

        /**
         * @protected
         * @param {function(Error=)} callback
         */
        validate: function(callback) {
            var cliActionInstance = this.cliBuild.getCliActionInstance();
            if (cliActionInstance) {
                var cliAction = cliActionInstance.getCliAction();
                this.validateCliAction(cliAction, callback);
            } else {
                callback(new Error("An action must be specified"));
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Error=)} callback
         */
        executeCliAction: function(callback) {
            var cliActionInstance = this.cliBuild.getCliActionInstance();
            var cliAction = cliActionInstance.getCliAction();
            var executeMethod = cliAction.getExecuteMethod();
            executeMethod(this.cliBuild, cliActionInstance, function(error) {
                callback(error);
            });
        },

        /**
         * @private
         * @param {CliAction} cliAction
         * @param {function(Error=)} callback
         */
        validateCliAction: function(cliAction, callback) {
            var cliActionInstance = this.cliBuild.getCliActionInstance();
            var validateMethod = cliAction.getValidateMethod();
            if (validateMethod) {
                validateMethod(this.cliBuild, cliActionInstance, function(error) {
                    callback(error);
                });
            } else {
                callback();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliRunner', CliRunner);
});
