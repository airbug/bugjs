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
//@Require('bugioc.BugIoc')
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
    var BugIoc                      = bugpack.require('bugioc.BugIoc');
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
             * @type {AutowiredTagScan}
             */
            this.autowiredScan          = BugIoc.autowiredScan(BugMeta.context());

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext             = BugIoc.context();

            /**
             * @private
             * @type {ModuleTagScan}
             */
            this.moduleTagScan          = BugIoc.moduleScan(BugMeta.context());
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        start: function(callback) {
            try {
                this.autowiredScan.scanAll();
                this.autowiredScan.scanContinuous();
                this.moduleTagScan.scanBugpacks([
                    "bugentity.EntityDeltaBuilder",
                    "bugentity.EntityManagerStore",
                    "bugentity.SchemaManager",
                    "bugmigrate.MigrationConfiguration",
                    "bugmigrate.MigrationInitializer",
                    "bugmigrate.MigrationManager",
                    "configbug.Configbug",
                    "loggerbug.Logger",
                    "mongo.MongoDataStore"
                ]);
                this.iocContext.generate();
            } catch(throwable) {
                return callback(throwable);
            }
            this.iocContext.start(callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        stop: function(callback) {
            this.iocContext.stop(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationApplication', MigrationApplication);
});
