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

//@Export('bugcli.CliFlagInstance')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugcli.CliParameterInstance')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Map                     = bugpack.require('Map');
    var Obj                     = bugpack.require('Obj');
    var CliParameterInstance    = bugpack.require('bugcli.CliParameterInstance');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliFlagInstance = Class.extend(Obj, {

        _name: "bugcli.CliFlagInstance",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CliFlag} cliFlag
         */
        _constructor: function(cliFlag) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CliFlag}
             */
            this.cliFlag = cliFlag;

            /**
             * @private
             * @type {Map.<string, CliParameterInstance>}
             */
            this.cliParameterInstanceMap = new Map();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------


        /**
         * @param {string} parameterName
         * @param {string} value
         */
        addCliParameterInstance: function(parameterName, value) {
            var cliParameter = this.cliFlag.getCliParameterByName(parameterName);
            var cliParameterInstance = new CliParameterInstance(cliParameter, value);
            this.cliParameterInstanceMap.put(parameterName, cliParameterInstance);
        },

        /**
         * @param {string} parameterName
         * @return {boolean}
         */
        containsParameter: function(parameterName) {
            return this.cliParameterInstanceMap.containsKey(parameterName);
        },

        /**
         * @return {CliFlag}
         */
        getCliFlag: function() {
            return this.cliFlag;
        },

        /**
         * @param {string} parameterName
         * @return {CliParameterInstance}
         */
        getCliParameterInstance: function(parameterName) {
            return this.cliParameterInstanceMap.get(parameterName);
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.cliFlag.getName();
        },

        /**
         * @param {string} parameterName
         * @return {*}
         */
        getParameter: function(parameterName) {
            var cliParameterInstance = this.getCliParameterInstance(parameterName);
            if (cliParameterInstance) {
                return cliParameterInstance.getValue();
            }
            return null;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliFlagInstance', CliFlagInstance);
});
