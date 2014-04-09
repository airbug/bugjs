//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerProcessFactory')
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
var CreateWorkerProcessCommand            = bugpack.require('bugwork.CreateWorkerProcessCommand');
var DestroyWorkerProcessCommand          = bugpack.require('bugwork.DestroyWorkerProcessCommand');
var StartWorkerCommand            = bugpack.require('bugwork.StartWorkerCommand');
var StopWorkerCommand            = bugpack.require('bugwork.StopWorkerCommand');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkerProcessFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(marshaller) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Marshaller}
         */
        this.marshaller         = marshaller;
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


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {boolean} debug
     * @param {number} debugPort
     * @return {WorkerProcess}
     */
    factoryWorkerProcess: function(debug, debugPort) {
        return new WorkerProcess(debug, debugPort, this.marshaller);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkerProcessFactory).with(
    module("workerProcessFactory")
        .args([
            arg().ref("marshaller")
        ])
);



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugwork.WorkerProcessFactory', WorkerProcessFactory);
