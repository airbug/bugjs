//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugwork')

//@Export('WorkerAnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugmeta.IAnnotationProcessor')
//@Require('bugwork.WorkerRegistryEntry')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var IAnnotationProcessor    = bugpack.require('bugmeta.IAnnotationProcessor');
var WorkerRegistryEntry     = bugpack.require('bugwork.WorkerRegistryEntry');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerAnnotationProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(workerRegistry) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkerRegistry}
         */
        this.workerRegistry = workerRegistry;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {WorkerAnnotation} workerAnnotation
     */
    process: function(workerAnnotation) {
        var workerClass = workerAnnotation.getAnnotationReference();
        var workerName  = workerAnnotation.getWorkerName();
        if (!this.workerRegistry.hasRegistryEntryForName(workerName)) {
            var registryEntry = this.factoryWorkerRegistryEntry(workerName, workerClass);
            this.workerRegistry.addRegistryEntry(registryEntry);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} workerName
     * @param {Class} workerClass
     * @return {WorkerRegistryEntry}
     */
    factoryWorkerRegistryEntry: function(workerName, workerClass) {
        return new WorkerRegistryEntry(workerName, workerClass);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(WorkerAnnotationProcessor, IAnnotationProcessor);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerAnnotationProcessor', WorkerAnnotationProcessor);
