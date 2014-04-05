//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmigrate')

//@Export('MigrationManager')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.IProcessModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.MigrationAnnotationProcessor')
//@Require('bugmigrate.MigrationAnnotationScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                                     = require('bugpack').context(module);
var mongoose                                    = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                       = bugpack.require('Class');
var Obj                                         = bugpack.require('Obj');
var Set                                         = bugpack.require('Set');
var IProcessModule                              = bugpack.require('bugioc.IProcessModule');
var ModuleAnnotation                            = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation                          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                                     = bugpack.require('bugmeta.BugMeta');
var MigrationAnnotationProcessor                = bugpack.require('bugmigrate.MigrationAnnotationProcessor');
var MigrationAnnotationScan                     = bugpack.require('bugmigrate.MigrationAnnotationScan');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                                     = BugMeta.context();
var module                                      = ModuleAnnotation.module;
var property                                    = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MigrationManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
        var scan = new MigrationAnnotationScan(bugmeta, new MigrationAnnotationProcessor(this));
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

bugmeta.annotate(MigrationManager).with(
    module("migrationManager")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmigrate.MigrationManager', MigrationManager);
