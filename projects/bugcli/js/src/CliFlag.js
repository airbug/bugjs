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

//@Export('bugcli.CliFlag')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugcli.CliParameter')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var List            = bugpack.require('List');
    var Map             = bugpack.require('Map');
    var Obj             = bugpack.require('Obj');
    var Set             = bugpack.require('Set');
    var TypeUtil        = bugpack.require('TypeUtil');
    var CliParameter    = bugpack.require('bugcli.CliParameter');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliFlag = Class.extend(Obj, {

        _name: "bugcli.CliFlag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {} cliFlagObject
         */
        _constructor: function(cliFlagObject) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<string>}
             */
            this.flagSet = new Set();

            /**
             * @private
             * @type {string}
             */
            this.name = "";

            /**
             * @private
             * @type {List.<CliParameter>}
             */
            this.cliParameterList = new List();

            /**
             * @private
             * @type {Map.<string, CliParameter>}
             */
            this.cliParameterMap = new Map();

            //TODO BRN: We should replace this with the BugMarshaller

            var _this = this;
            if (TypeUtil.isObject(cliFlagObject)) {
                if (TypeUtil.isString(cliFlagObject.name)) {
                    this.name = cliFlagObject.name;
                }
                if (TypeUtil.isArray(cliFlagObject.flags)) {
                    cliFlagObject.flags.forEach(function(flag) {
                        if (TypeUtil.isString(flag)) {
                            _this.flagSet.add(flag);
                        }
                    });
                }
                if (TypeUtil.isArray(cliFlagObject.parameters)) {
                    cliFlagObject.parameters.forEach(function(parameterObject) {

                        //TODO BRN: We should replace this with the BugMarshaller

                        var cliParameter = new CliParameter(parameterObject);
                        _this.cliParameterList.add(cliParameter);
                        _this.cliParameterMap.put(cliParameter.getName(), cliParameter);
                    });
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<string>}
         */
        getFlagSet: function() {
            return this.flagSet;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @return {List.<CliParameter>}
         */
        getCliParameterList: function() {
            return this.cliParameterList;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} parameterName
         * @return {CliParameter}
         */
        getCliParameterByName: function(parameterName) {
            return this.cliParameterMap.get(parameterName);
        },

        /**
         * @return {boolean}
         */
        hasParameters: function() {
            return !this.cliParameterMap.isEmpty();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliFlag', CliFlag);
});
