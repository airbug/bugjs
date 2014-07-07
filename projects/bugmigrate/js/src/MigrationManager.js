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

//@Export('bugmigrate.MigrationManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.IConfiguringModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.MigrationTagProcessor')
//@Require('bugmigrate.MigrationTagScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var mongoose                = require('mongoose');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');
    var Set                     = bugpack.require('Set');
    var IConfiguringModule          = bugpack.require('bugioc.IConfiguringModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var MigrationTagProcessor   = bugpack.require('bugmigrate.MigrationTagProcessor');
    var MigrationTagScan        = bugpack.require('bugmigrate.MigrationTagScan');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IConfiguringModule}
     */
    var MigrationManager = Class.extend(Obj, {

        _name: "bugmigrate.MigrationManager",


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
             * @type {Set.<Migration>}
             */
            this.migrationSet       = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<Migration>}
         */
        getMigrationSet: function() {
            return this.migrationSet;
        },


        //-------------------------------------------------------------------------------
        // IConfiguringModule Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        configureModule: function() {
            var scan = new MigrationTagScan(bugmeta, new MigrationTagProcessor(this));
            scan.scanAll();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Migration} migration
         */
        registerMigration: function(migration) {
            this.migrationSet.add(migration);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MigrationManager, IConfiguringModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MigrationManager).with(
        module("migrationManager")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationManager', MigrationManager);
});
