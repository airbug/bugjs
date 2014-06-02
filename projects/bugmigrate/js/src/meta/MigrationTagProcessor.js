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

//@Export('bugmigrate.MigrationTagProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugmeta.ITagProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var Set             = bugpack.require('Set');
    var ITagProcessor   = bugpack.require('bugmeta.ITagProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ITagProcessor}
     */
    var MigrationTagProcessor = Class.extend(Obj, {

        _name: "bugmigrate.MigrationTagProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MigrationManager} migrationManager
         */
        _constructor: function(migrationManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MigrationManager}
             */
            this.migrationManager           = migrationManager;

            /**
             * @private
             * @type {Set.<Tag>}
             */
            this.processedTagSet     = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MigrationManager}
         */
        getMigrationManager: function() {
            return this.migrationManager;
        },


        //-------------------------------------------------------------------------------
        // ITagProcessor Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Tag} tag
         */
        process: function(tag) {
            this.processMigrationTag(/** @type {MigrationTag} */(tag));
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {MigrationTag} migrationTag
         */
        buildMigration: function(migrationTag) {
            var migrationConstructor    = migrationTag.getTagReference();
            var migration               = new migrationConstructor(migrationTag.getMigrationAppName(), migrationTag.getMigrationAppVersion(), migrationTag.getMigrationName(), migrationTag.getMigrationVersion());
            this.migrationManager.registerMigration(migration);
        },

        /**
         * @protected
         * @param {MigrationTag} migrationTag
         */
        processMigrationTag: function(migrationTag) {
            if (!this.processedTagSet.contains(migrationTag)) {
                this.buildMigration(migrationTag);
                this.processedTagSet.add(migrationTag);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationTagProcessor', MigrationTagProcessor);
});
