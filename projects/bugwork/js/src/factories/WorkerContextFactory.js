//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugwork.WorkerContextFactory')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.WorkerContext')


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
    var WorkerContext                   = bugpack.require('bugwork.WorkerContext');


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
    var WorkerContextFactory = Class.extend(Obj, {

        _name: "bugwork.WorkerContextFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {WorkerCommandFactory} workerCommandFactory
         */
        _constructor: function(logger, workerCommandFactory) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Logger}
             */
            this.logger                     = logger;

            /**
             * @private
             * @type {WorkerCommandFactory}
             */
            this.workerCommandFactory       = workerCommandFactory;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {WorkerCommandFactory}
         */
        getWorkerCommandFactory: function() {
            return this.workerCommandFactory;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} workerName
         * @param {boolean} debug
         * @param {number} debugPort
         * @return {WorkerContext}
         */
        factoryWorkerContext: function(workerName, debug, debugPort) {
            return new WorkerContext(workerName, debug, debugPort, this.logger, this.workerCommandFactory);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(WorkerContextFactory).with(
        module("workerContextFactory")
            .args([
                arg().ref("logger"),
                arg().ref("workerCommandFactory")
            ])
    );



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugwork.WorkerContextFactory', WorkerContextFactory);
});
