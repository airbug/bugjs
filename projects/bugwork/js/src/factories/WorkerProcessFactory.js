//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerProcessFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.WorkerProcess')
//@Require('bugwork.CreateWorkerProcessCommand')
//@Require('bugwork.DestroyWorkerProcessCommand')
//@Require('bugwork.StartWorkerCommand')
//@Require('bugwork.StopWorkerCommand')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Obj                             = bugpack.require('Obj');
    var ArgTag                   = bugpack.require('bugioc.ArgTag');
    var ModuleTag                = bugpack.require('bugioc.ModuleTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var WorkerProcess                   = bugpack.require('bugwork.WorkerProcess');
    var CreateWorkerProcessCommand            = bugpack.require('bugwork.CreateWorkerProcessCommand');
    var DestroyWorkerProcessCommand          = bugpack.require('bugwork.DestroyWorkerProcessCommand');
    var StartWorkerCommand            = bugpack.require('bugwork.StartWorkerCommand');
    var StopWorkerCommand            = bugpack.require('bugwork.StopWorkerCommand');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                             = ArgTag.arg;
    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var WorkerProcessFactory = Class.extend(Obj, {

        _name: "bugwork.WorkerProcessFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Marshaller} marshaller
         */
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

    bugmeta.tag(WorkerProcessFactory).with(
        module("workerProcessFactory")
            .args([
                arg().ref("marshaller")
            ])
    );



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugwork.WorkerProcessFactory', WorkerProcessFactory);
});
