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

//@Export('bugioc.ModuleTag')

//@Require('Class')
//@Require('bugmeta.Tag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Tag     = bugpack.require('bugmeta.Tag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Tag}
     */
    var ModuleTag = Class.extend(Tag, {

        _name: "bugioc.ModuleTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} moduleName
         */
        _constructor: function(moduleName) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<ArgTag>}
             */
            this.moduleArgs         = [];

            /**
             * @private
             * @type {string}
             */
            this.moduleName         = moduleName;

            /**
             * @private
             * @type {Array.<PropertyTag>}
             */
            this.moduleProperties   = [];

            /**
             * @private
             * @type {ModuleTag.Scope}
             */
            this.moduleScope        = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<ArgTag>}
         */
        getModuleArgs: function() {
            return this.moduleArgs;
        },

        /**
         * @return {string}
         */
        getModuleName: function() {
            return this.moduleName;
        },

        /**
         * @return {Array.<PropertyTag>}
         */
        getModuleProperties: function() {
            return this.moduleProperties;
        },

        /**
         * @return {ModuleTag.Scope}
         */
        getModuleScope: function() {
            return this.moduleScope;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<ArgTag>} moduleArgs
         */
        args: function(moduleArgs) {
            this.moduleArgs = moduleArgs;
            return this;
        },

        /**
         * @param {string} moduleName
         */
        name: function(moduleName) {
            this.moduleName = moduleName;
            return this;
        },

        /**
         * @param {Array.<PropertyTag>} moduleProperties
         */
        properties: function(moduleProperties) {
            this.moduleProperties = moduleProperties;
            return this;
        },

        /**
         * @param {ModuleTag.Scope} methodScope
         */
        scope: function(methodScope) {
            this.moduleScope = methodScope;
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} moduleName
     * @return {ModuleTag}
     */
    ModuleTag.module = function(moduleName) {
        return new ModuleTag(moduleName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleTag', ModuleTag);
});
