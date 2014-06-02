/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//TODO BRN: This server needs to include the DeployBug communications socket api. It should let deploybug

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('clientjs.ClientJSServer')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('clientjs.ClientPackageRegistry')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var express = require('express');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class =                     bugpack.require('Class');
    var Obj =                       bugpack.require('Obj');
    var BugFlow =                   bugpack.require('bugflow.BugFlow');
    var BugFs =                     bugpack.require('bugfs.BugFs');
    var ClientPackageRegistry =     bugpack.require('clientjs.ClientPackageRegistry');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $forEachParallel =  BugFlow.$forEachParallel;
    var $parallel =         BugFlow.$parallel;
    var $series =           BugFlow.$series;
    var $task =             BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ClientJSServer = Class.extend(Obj, {

        _name: "clientjs.ClientJSServer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         */
        _constructor: function(expressApp) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ClientPackageRegistry}
             */
            this.clientPackageRegistry = new ClientPackageRegistry();

            /**
             * @private
             * @type {Path}
             */
            this.clientPath = BugFs.resolvePaths([process.cwd(), ".client"]);

            /**
             * @private
             * @type {ExpressApp}
             */
            this.expressApp = expressApp;

            /**
             * @private
             * @type {Path}
             */
            this.packagesPath = BugFs.resolvePaths([this.clientPath, "packages"]);

            /**
             * @private
             * @type {Path}
             */
            this.staticPath = BugFs.resolvePaths([this.clientPath, "static"]);

            /**
             * @private
             * @type {Path}
             */
            this.tmpPath = BugFs.resolvePaths([this.clientPath, ".tmp"]);

            /**
             * @private
             * @type {Path}
             */
            this.viewsPath = BugFs.resolvePaths([this.clientPath, "views"]);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Error)} callback
         */
        initializeServer: function(callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.setupClientDirectory(function(error) {
                        flow.complete(error);
                    })
                }),
                $task(function(flow) {
                    _this.buildClientPackageRegistry(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.deployAllClientPackages(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.monitorClientDirectory(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.setupExpressApp();
                    flow.complete();
                })
            ]).execute(function(error) {
                callback(error);
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        buildClientPackageRegistry: function(callback) {
            this.clientPackageRegistry.buildRegistry(this.packagesPath, callback);
        },

        /**
         * @private
         */
        deployClientPackage: function() {
            //TODO BRN: Reset the client package (delete the directory in .client/static/[package-name]
            //TODO BRN: Extract the entire file to the static directory
            //TODO BRN: Create a new directory in the views directory that has the same name as the client package (if a directory already exists, we should delete it)

        },

        /**
         * @private
         * @param {function(Error)} callback
         */
        deployAllClientPackages: function(callback) {
             //Loop through all packages in the registry and deploy each one.

        },

        /**
         * @private
         */
        monitorClientDirectory: function() {
            //TODO BRN: Add a listener for changes to the client directory.
            //TODO BRN: Loop through all items in the registry and deploy each one.
            //TODO BRN: Add a file change listener to the .client folder.
            //TODO BRN: When a change is detected, (if a specific file is indicated as changed) regenerate the md5 hash to see if it has actually changed
        },

        /**
         * @private
         * @param {Path} packagePath
         * @param {function(Error)} callback
         */
        processPackagePath: function(packagePath, callback) {

        },

        /**
         * @private
         */
        setupClientDirectory: function(callback) {

            // NOTE BRN: We don't delete the directories here because want to allow the deployed packages to persist on
            // server restart. If we deleted here, it would mean that we have to redeploy the packages every time the
            // server restarts, which could be extremely slow in terms of workflow.

            var _this = this;
            $parallel([
                $task(function(flow) {
                    _this.packagesPath.createDirectory(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.staticPath.createDirectory(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.tmpPath.createDirectory(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.viewsPath.createDirectory(function(error) {
                        flow.complete(error);
                    });
                })
            ]).execute(function(error) {
                callback(error);
            });
        },

        /**
         * @private
         */
        setupExpressApp: function() {
            this.expressApp.use(express.static(this.staticPath.getAbsolutePath()));

            //NOTE BRN: This lets express know where the views are contained

            this.expressApp.set('views', this.viewsPath.getAbsolutePath());
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('clientjs.ClientJSServer', ClientJSServer);
});
