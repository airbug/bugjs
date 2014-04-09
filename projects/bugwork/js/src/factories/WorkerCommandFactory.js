//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerCommandFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.WorkerProcess')
//@Require('bugwork.CreateWorkerProcessCommand')
//@Require('bugwork.DestroyWorkerProcessCommand')
//@Require('bugwork.StartWorkerCommand')
//@Require('bugwork.StopWorkerCommand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var WorkerProcess                   = bugpack.require('bugwork.WorkerProcess');
var CreateWorkerProcessCommand      = bugpack.require('bugwork.CreateWorkerProcessCommand');
var DestroyWorkerProcessCommand     = bugpack.require('bugwork.DestroyWorkerProcessCommand');
var StartWorkerCommand              = bugpack.require('bugwork.StartWorkerCommand');
var StopWorkerCommand               = bugpack.require('bugwork.StopWorkerCommand');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerCommandFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(marshaller, workerProcessFactory) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Marshaller}
         */
        this.marshaller                 = marshaller;

        /**
         * @private
         * @type {WorkerProcessFactory}
         */
        this.workerProcessFactory       = workerProcessFactory;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Marshaller}
     */
    getMarshaller: function() {
        return this.marshaller;
    },

    /**
     * @return {WorkerProcessFactory}
     */
    getWorkerProcessFactory: function() {
        return this.workerProcessFactory;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {WorkerContext} workerContext
     * @return {CreateWorkerProcessCommand}
     */
    factoryCreateWorkerProcessCommand: function(workerContext) {
        return new CreateWorkerProcessCommand(workerContext, this.workerProcessFactory);
    },

    /**
     * @param {WorkerContext} workerContext
     * @return {DestroyWorkerProcessCommand}
     */
    factoryDestroyWorkerProcessCommand: function(workerContext) {
        return new DestroyWorkerProcessCommand(workerContext);
    },

    /**
     * @param {WorkerContext} workerContext
     * @return {StartWorkerCommand}
     */
    factoryStartWorkerCommand: function(workerContext) {
        return new StartWorkerCommand(workerContext, this.marshaller);
    },

    /**
     * @param {WorkerContext} workerContext
     * @return {StopWorkerCommand}
     */
    factoryStopWorkerCommand: function(workerContext) {
        return new StopWorkerCommand(workerContext);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkerCommandFactory).with(
    module("workerCommandFactory")
        .args([
            arg().ref("marshaller"),
            arg().ref("workerProcessFactory")
        ])
);



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerCommandFactory', WorkerCommandFactory);
