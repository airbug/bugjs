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
//@Require('bugentity.EntityManagerAnnotationProcessor')
//@Require('bugentity.EntityManagerAnnotationScan')
//@Require('bugioc.AutowiredAnnotationProcessor')
//@Require('bugioc.AutowiredScan')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var Obj                                 = bugpack.require('Obj');
    var EntityManagerAnnotationProcessor    = bugpack.require('bugentity.EntityManagerAnnotationProcessor');
    var EntityManagerAnnotationScan         = bugpack.require('bugentity.EntityManagerAnnotationScan');
    var AutowiredAnnotationProcessor        = bugpack.require('bugioc.AutowiredAnnotationProcessor');
    var AutowiredScan                       = bugpack.require('bugioc.AutowiredScan');
    var ConfigurationAnnotationProcessor    = bugpack.require('bugioc.ConfigurationAnnotationProcessor');
    var ConfigurationScan                   = bugpack.require('bugioc.ConfigurationScan');
    var IocContext                          = bugpack.require('bugioc.IocContext');
    var ModuleAnnotationProcessor           = bugpack.require('bugioc.ModuleAnnotationProcessor');
    var ModuleScan                          = bugpack.require('bugioc.ModuleScan');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');


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
             * @type {AutowiredScan}
             */
            this.autowiredScan                  = new AutowiredScan(BugMeta.context(), new AutowiredAnnotationProcessor(this.iocContext));

            /**
             * @private
             * @type {ConfigurationScan}
             */
            this.configurationScan              = new ConfigurationScan(BugMeta.context(), new ConfigurationAnnotationProcessor(this.iocContext));

            /**
             * @private
             * @type {EntityManagerAnnotationScan}
             */
            this.entityManagerAnnotationScan    = new EntityManagerAnnotationScan(BugMeta.context(), new EntityManagerAnnotationProcessor(this.iocContext));

            /**
             * @private
             * @type {ModuleScan}
             */
            this.moduleScan                     = new ModuleScan(BugMeta.context(), new ModuleAnnotationProcessor(this.iocContext));
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
            this.configurationScan.scanBugpacks([
                "bugmigrate.MigrationConfiguration"
            ]);
            this.entityManagerAnnotationScan.scanAll();
            this.moduleScan.scanBugpacks([
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
