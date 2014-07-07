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

//@Export('bugcli.CliBuild')

//@Require('Class')
//@Requite('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Map     = bugpack.require('Map');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliBuild = Class.extend(Obj, {

        _name: "bugcli.CliBuild",


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
             * @type {CliActionInstance}
             */
            this.cliActionInstance = null;

            /**
             * @private
             * @type {Map.<string, CliOptionInstance>}
             */
            this.cliOptionInstanceMap = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         *
         * @return {CliActionInstance}
         */
        getCliActionInstance: function() {
            return this.cliActionInstance;
        },

        /**
         * @param {CliActionInstance} cliActionInstance
         */
        setCliActionInstance: function(cliActionInstance) {
            this.cliActionInstance = cliActionInstance;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CliOptionInstance} cliOptionInstance
         */
        addCliOptionInstance: function(cliOptionInstance) {
            this.cliOptionInstanceMap.put(cliOptionInstance.getCliOption().getName(), cliOptionInstance);
        },

        /**
         * @return {CliActionInstance}
         */
        getAction: function() {
            return this.cliActionInstance;
        },

        /**
         * @param {string} optionName
         * @return {CliOptionInstance}
         */
        getOption: function(optionName) {
            return this.getCliOptionInstance(optionName);
        },

        /**
         * @return {CliOptionInstance}
         */
        getCliOptionInstance: function(optionName) {
            return this.cliOptionInstanceMap.get(optionName);
        },

        /**
         * @return {boolean}
         */
        hasCliActionInstance: function() {
            return this.cliActionInstance !== null;
        },

        /**
         * @param {CliOptionInstance} cliOptionInstance
         * @return {boolean}
         */
        hasCliOptionInstance: function(cliOptionInstance) {
            return this.cliOptionInstanceMap.containsValue(cliOptionInstance);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliBuild', CliBuild);
});
