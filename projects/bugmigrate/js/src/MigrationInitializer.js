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

//@Export('bugmigrate.MigrationInitializer')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.MigrationModel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var BugFlow             = bugpack.require('bugflow.BugFlow');
    var BugFs               = bugpack.require('bugfs.BugFs');
    var IInitializeModule   = bugpack.require('bugioc.IInitializeModule');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var MigrationModel      = bugpack.require('bugmigrate.MigrationModel');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var property            = PropertyTag.property;
    var $iterableSeries     = BugFlow.$iterableSeries;
    var $series             = BugFlow.$series;
    var $task               = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializeModule}
     */
    var MigrationInitializer = Class.extend(Obj, {

        _name: "bugmigrate.MigrationInitializer",


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
             * @type {Configbug}
             */
            this.configbug              = null;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                 = null;

            /**
             * @private
             * @type {MigrationManager}
             */
            this.migrationManager       = null;

            /**
             * @private
             * @type {MongoDataStore}
             */
            this.mongoDataStore         = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Configbug}
         */
        getConfigbug: function() {
            return this.configbug;
        },

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {MigrationManager}
         */
        getMigrationManager: function() {
            return this.migrationManager;
        },

        /**
         * @return {MongoDataStore}
         */
        getMongoDataStore: function() {
            return this.mongoDataStore;
        },


        //-------------------------------------------------------------------------------
        // IInitializeModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            var _this       = this;
            this.logger.info("Initializing MigrationInitializer");

            /** @type {string} */
            var configName  = this.generateConfigName();
            /** @type {Config} */
            var config      = null;

            $series([
                $task(function(flow) {
                    _this.configbug.setConfigPath(BugFs.resolvePaths([__dirname, '../resources/config']));
                    _this.loadConfig(configName, function(throwable, loadedConfig) {
                        if (!throwable) {
                            config = loadedConfig;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.mongoDataStore.connect('mongodb://' + config.getProperty("mongoDbIp") + '/airbug');
                    _this.runMigrations(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(error){
                if (!error) {
                    _this.logger.info("Migration successfully completed");
                    callback();
                } else {
                    _this.logger.error(error);
                    callback();
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {string}
         */
        generateConfigName: function() {
            var configName = "dev";
            var index = process.argv.indexOf("--config");
            if (index > -1) {
                configName = process.argv[index + 1];
            } else if (process.env.CONFIGBUG) {
                configName = process.env.CONFIGBUG;
            }
            return configName;
        },

        /**
         * @private
         * @param {string} configName
         * @param {function(Throwable, Config=)} callback
         */
        loadConfig: function(configName, callback) {
            this.configbug.getConfig(configName, callback);
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        runMigrations: function(callback) {
            var _this       = this;
            var migrations  = this.migrationManager.getMigrationSet();
            $iterableSeries(migrations, function(flow, migration){
                var migrationName       = migration.getName();
                var migrationVersion    = migration.getVersion();
                var migrationAppVersion = migration.getAppVersion();

                _this.logger.info("checking to see if the migration has been previously run..");
                MigrationModel.findOne({appVersion: migrationAppVersion, version: migrationVersion, name: migrationName}, function(error, returnedMigration){
                    if (!error) {
                        if (!returnedMigration) {

                            _this.logger.info("Running", migrationName, "...");
                            var migrationDoc        = new MigrationModel();
                            migrationDoc.name       = migrationName;
                            migrationDoc.version    = migrationVersion;
                            migrationDoc.appVersion = migrationAppVersion;

                            migration.up(function(error) {
                                if (!error) {
                                    _this.logger.info(migrationName, "migration number:", migrationVersion, " for app version ", migrationAppVersion, " completed successfully");
                                    migrationDoc.save(function(error, returnedMigration, numberAffected) {
                                        if (!error) {
                                            if (numberAffected === 1) {
                                                _this.logger.info("migrationDoc for", migrationName, "has been saved");
                                                flow.complete();
                                            } else {
                                                flow.complete(new Error("migrationDoc was not saved"));
                                            }
                                        } else {
                                            flow.complete(error);
                                        }
                                    });
                                } else {
                                    _this.logger.info("migration '", migrationName, "' failed");
                                    flow.complete(error);
                                }
                            });
                        } else {
                            _this.logger.info(migrationName, "migration number:", migrationVersion, " for app version ", migrationAppVersion, " has already been run");
                            flow.complete();
                        }
                    } else {
                        flow.error(error);
                    }
                });
            }).execute(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MigrationInitializer, IInitializeModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MigrationInitializer).with(
        module("migrationInitializer")
            .properties([
                property("configbug").ref("configbug"),
                property("logger").ref("logger"),
                property("migrationManager").ref("migrationManager"),
                property("mongoDataStore").ref("mongoDataStore")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmigrate.MigrationInitializer', MigrationInitializer);
});
