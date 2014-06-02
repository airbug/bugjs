//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmigrate.MigrationManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.IProcessModule')
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

    var mongoose                                    = require('mongoose');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                                       = bugpack.require('Class');
    var Obj                                         = bugpack.require('Obj');
    var Set                                         = bugpack.require('Set');
    var IProcessModule                              = bugpack.require('bugioc.IProcessModule');
    var ModuleTag                            = bugpack.require('bugioc.ModuleTag');
    var PropertyTag                          = bugpack.require('bugioc.PropertyTag');
    var BugMeta                                     = bugpack.require('bugmeta.BugMeta');
    var MigrationTagProcessor                = bugpack.require('bugmigrate.MigrationTagProcessor');
    var MigrationTagScan                     = bugpack.require('bugmigrate.MigrationTagScan');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                                     = BugMeta.context();
    var module                                      = ModuleTag.module;
    var property                                    = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IProcessModule}
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
        // IProcessModule Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        processModule: function() {
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

    Class.implement(MigrationManager, IProcessModule);


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
