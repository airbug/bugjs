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

//@Export('bugmigrate.MigrationTag')

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
    var MigrationTag = Class.extend(Tag, {

        _name: "bugmigrate.MigrationTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super(MigrationTag.TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.migrationAppName       = null;

            /**
             * @private
             * @type {string}
             */
            this.migrationAppVersion    = null;

            /**
             * @private
             * @type {string}
             */
            this.migrationName          = null;

            /**
             * @private
             * @type {string}
             */
            this.migrationVersion       = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getMigrationAppName: function() {
            return this.migrationAppName;
        },

        /**
         * @return {string}
         */
        getMigrationAppVersion: function() {
            return this.migrationAppVersion;
        },

        /**
         * @return {string}
         */
        getMigrationName: function() {
            return this.migrationName;
        },

        /**
         * @return {string}
         */
        getMigrationVersion: function() {
            return this.migrationVersion;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} migrationAppName
         * @return {MigrationTag}
         */
        appName: function(migrationAppName) {
            this.migrationAppName = migrationAppName;
            return this;
        },

        /**
         * @param {string} migrationAppVersion
         * @return {MigrationTag}
         */
        appVersion: function(migrationAppVersion) {
            this.migrationAppVersion = migrationAppVersion;
            return this;
        },

        /**
         * @param {string} migrationName
         */
        name: function(migrationName) {
            this.migrationName = migrationName;
            return this;
        },

        /**
         * @param {string} migrationVersion
         * @return {MigrationTag}
         */
        version: function(migrationVersion) {
            this.migrationVersion = migrationVersion;
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    MigrationTag.TYPE = "Migration";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {MigrationTag}
     */
    MigrationTag.migration = function() {
        return new MigrationTag();
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationTag', MigrationTag);
});
