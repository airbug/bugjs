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

//@Export('bugwork.WorkerManager')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.WorkerMaster')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var TypeUtil            = bugpack.require('TypeUtil');
    var BugFlow             = bugpack.require('bugflow.BugFlow');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var IInitializeModule   = bugpack.require('bugioc.IInitializeModule');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var WorkerMaster        = bugpack.require('bugwork.WorkerMaster');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var $iterableParallel   = BugFlow.$iterableParallel;
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
    var WorkerManager = Class.extend(Obj, {

        _name: "bugwork.WorkerManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {WorkerRegistry} workerRegistry
         * @param {WorkerContextFactory} workerContextFactory
         */
        _constructor: function(workerRegistry, workerContextFactory) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<WorkerMaster>}
             */
            this.workerMasterSet                = new Set();

            /**
             * @private
             * @type {WorkerContextFactory}
             */
            this.workerContextFactory           = workerContextFactory;

            /**
             * @private
             * @type {WorkerRegistry}
             */
            this.workerRegistry                 = workerRegistry;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {WorkerContextFactory}
         */
        getWorkerContextFactory: function() {
            return this.workerContextFactory;
        },


        //-------------------------------------------------------------------------------
        // IInitializeModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            this.destroyAllWorkers(callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            callback();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} workerName
         * @param {{
         *      maxConcurrency: number,
         *      debug: boolean=
         * }} options
         * @param {function(Throwable=)} callback
         */
        createWorker: function(workerName, options, callback) {
            var debug = (process.execArgv.indexOf("--debug") >= 0);
            var workerMaster = this.factoryWorkerMaster(workerName, options.maxConcurrency, debug);
            this.workerMasterSet.add(workerMaster);

            //TEST
            console.log("WorkerManager#createWorker - workerName:", workerName, " maxConcurrency:", options.maxConcurrency, " debug:", debug);

            $task(function(flow) {
                workerMaster.createAndStartWorkers(function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @param {WorkerMaster} workerMaster
         * @param {function(Throwable=)} callback
         */
        destroyWorker: function(workerMaster, callback) {
            if (this.workerMasterSet.contains(workerMaster)) {
                this.workerMasterSet.remove(workerMaster);
                $task(function(flow) {
                    workerMaster.stopAndDestroyWorkers(function(throwable) {
                        flow.complete(throwable);
                    });
                }).execute(callback);
            } else {
                callback();
            }
        },

        /**
         * @param {function(Throwable=)} callback
         */
        destroyAllWorkers: function(callback) {
            var _this = this;
            $iterableParallel(this.workerMasterSet.clone(), function(flow, workerMaster) {
                _this.destroyWorker(workerMaster, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} workerName
         * @param {number} maxConcurrency
         * @param {boolean} debug
         * @returns {WorkerMaster}
         */
        factoryWorkerMaster: function(workerName, maxConcurrency, debug) {
            return new WorkerMaster(workerName, maxConcurrency, debug, this.workerContextFactory);
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(WorkerManager, IInitializeModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(WorkerManager).with(
        module("workerManager")
            .args([
                arg().ref("workerRegistry"),
                arg().ref("workerContextFactory")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugwork.WorkerManager', WorkerManager);
});
