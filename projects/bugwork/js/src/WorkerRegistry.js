//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerRegistry')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.WorkerTagProcessor')
//@Require('bugwork.WorkerTagScan')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                             = bugpack.require('Bug');
    var Class                           = bugpack.require('Class');
    var Map                             = bugpack.require('Map');
    var Obj                             = bugpack.require('Obj');
    var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
    var ModuleTag                = bugpack.require('bugioc.ModuleTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var WorkerTagProcessor       = bugpack.require('bugwork.WorkerTagProcessor');
    var WorkerTagScan                      = bugpack.require('bugwork.WorkerTagScan');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializeModule}
     */
    var WorkerRegistry = Class.extend(Obj, {

        _name: "bugwork.WorkerRegistry",


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
             * @type {Map.<string, WorkerRegistryEntry>}
             */
            this.workerNameToWorkerRegistryEntryMap     = new Map();
        },


        //-------------------------------------------------------------------------------
        // IInitializeModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            this.workerNameToWorkerRegistryEntryMap.clear();
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            var scan = new WorkerTagScan(bugmeta, new WorkerTagProcessor(this));
            scan.scanAll();
            callback();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {WorkerRegistryEntry} registryEntry
         */
        addRegistryEntry: function(registryEntry) {
            if (this.hasRegistryEntryForName(registryEntry.getWorkerName())) {
                throw new Bug("IllegalState", {}, "registry already has an entry by the name of '" + registryEntry.getWorkerName() + "'");
            }
            this.workerNameToWorkerRegistryEntryMap.put(registryEntry.getWorkerName(), registryEntry);
        },

        /**
         * @param {string} workerName
         * @return {WorkerRegistryEntry}
         */
        getRegistryEntryForName: function(workerName) {
            return this.workerNameToWorkerRegistryEntryMap.get(workerName);
        },

        /**
         * @param {string} workerName
         * @returns {boolean}
         */
        hasRegistryEntryForName: function(workerName) {
            return this.workerNameToWorkerRegistryEntryMap.containsKey(workerName);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(WorkerRegistry, IInitializeModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(WorkerRegistry).with(
        module("workerRegistry")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugwork.WorkerRegistry', WorkerRegistry);
});
