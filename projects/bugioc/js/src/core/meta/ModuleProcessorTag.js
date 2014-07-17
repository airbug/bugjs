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

//@Export('bugioc.ModuleProcessorTag')

//@Require('Class')
//@Require('bugmeta.Tag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Tag         = bugpack.require('bugmeta.Tag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Tag}
     */
    var ModuleProcessorTag = Class.extend(Tag, {

        _name: "bugioc.ModuleProcessorTag",


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
             * @type {string}
             */
            this.deprocessMethodName    = null;

            /**
             * @private
             * @type {string}
             */
            this.processMethodName      = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getDeprocessMethodName: function() {
            return this.deprocessMethodName;
        },

        /**
         * @return {string}
         */
        getProcessMethodName: function() {
            return this.processMethodName;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} deprocessMethodName
         * @return {ModuleProcessorTag}
         */
        deprocessMethod: function(deprocessMethodName) {
            this.deprocessMethodName = deprocessMethodName;
            return this;
        },

        /**
         * @param {string} processMethodName
         * @return {ModuleProcessorTag}
         */
        processMethod: function(processMethodName) {
            this.processMethodName = processMethodName;
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {ModuleProcessorTag}
     */
    ModuleProcessorTag.moduleProcessor = function() {
        return new ModuleProcessorTag();
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleProcessorTag', ModuleProcessorTag);
});
