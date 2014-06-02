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

//@Export('bugmigrate.MigrationApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityManagerTagProcessor')
//@Require('bugentity.EntityManagerTagScan')
//@Require('bugioc.AutowiredTagProcessor')
//@Require('bugioc.AutowiredTagScan')
//@Require('bugioc.ConfigurationTagProcessor')
//@Require('bugioc.ConfigurationTagScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleTagProcessor')
//@Require('bugioc.ModuleTagScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var EntityManagerTagProcessor   = bugpack.require('bugentity.EntityManagerTagProcessor');
    var EntityManagerTagScan        = bugpack.require('bugentity.EntityManagerTagScan');
    var AutowiredTagProcessor       = bugpack.require('bugioc.AutowiredTagProcessor');
    var AutowiredTagScan            = bugpack.require('bugioc.AutowiredTagScan');
    var ConfigurationTagProcessor   = bugpack.require('bugioc.ConfigurationTagProcessor');
    var ConfigurationTagScan        = bugpack.require('bugioc.ConfigurationTagScan');
    var IocContext                  = bugpack.require('bugioc.IocContext');
    var ModuleTagProcessor          = bugpack.require('bugioc.ModuleTagProcessor');
    var ModuleTagScan               = bugpack.require('bugioc.ModuleTagScan');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MigrationApplication = Class.extend(Obj, {

        _name: "bugmigrate.MigrationApplication",


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
             * @type {IocContext}
             */
            this.iocContext                     = new IocContext();

            /**
             * @private
             * @type {AutowiredTagScan}
             */
            this.autowiredScan                  = new AutowiredTagScan(BugMeta.context(), new AutowiredTagProcessor(this.iocContext));

            /**
             * @private
             * @type {ConfigurationTagScan}
             */
            this.configurationTagScan              = new ConfigurationTagScan(BugMeta.context(), new ConfigurationTagProcessor(this.iocContext));

            /**
             * @private
             * @type {EntityManagerTagScan}
             */
            this.entityManagerTagScan    = new EntityManagerTagScan(BugMeta.context(), new EntityManagerTagProcessor(this.iocContext));

            /**
             * @private
             * @type {ModuleTagScan}
             */
            this.moduleTagScan                     = new ModuleTagScan(BugMeta.context(), new ModuleTagProcessor(this.iocContext));
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        start: function(callback) {
            this.autowiredScan.scanAll();
            this.autowiredScan.scanContinuous();
            this.configurationTagScan.scanBugpacks([
                "bugmigrate.MigrationConfiguration"
            ]);
            this.entityManagerTagScan.scanAll();
            this.moduleTagScan.scanBugpacks([
                "bugentity.EntityDeltaBuilder",
                "bugentity.EntityManagerStore",
                "bugentity.SchemaManager",
                "bugmigrate.MigrationInitializer",
                "bugmigrate.MigrationManager",
                "configbug.Configbug",
                "loggerbug.Logger",
                "mongo.MongoDataStore"
            ]);
            this.iocContext.process();
            this.iocContext.initialize(callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        stop: function(callback) {
            this.iocContext.deinitialize(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationApplication', MigrationApplication);
});
