//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcli')

//@Export('CliRunner')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var BugFlow =   bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series =   BugFlow.$series;
var $task =     BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CliRunner = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cli, cliBuild) {

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


    //-------------------------------------------------------------------------------
    // Class Methods
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
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        callback();
    },

    /**
     * @protected
     * @param {function(Error)} callback
     */
    validate: function(callback) {
        var cliActionInstance = this.cliBuild.getCliActionInstance();
        if (cliActionInstance) {
            var cliAction = cliActionInstance.getCliAction();
            var validateMethod = cliAction.getValidateMethod();
            validateMethod(this.cliBuild, cliActionInstance, function(error) {
                callback(error);
            });
        } else {
            callback(new Error("An action must be specified"));
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Error)} callback
     */
    executeCliAction: function(callback) {
        var cliActionInstance = this.cliBuild.getCliActionInstance();
        var cliAction = cliActionInstance.getCliAction();
        var executeMethod = cliAction.getExecuteMethod();
        executeMethod(this.cliBuild, cliActionInstance, function(error) {
            callback(error);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcli.CliRunner', CliRunner);
