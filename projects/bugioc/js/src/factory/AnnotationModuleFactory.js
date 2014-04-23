//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.AnnotationModuleFactory')

//@Require('Class')
//@Require('bugioc.ModuleFactory')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ModuleFactory       = bugpack.require('bugioc.ModuleFactory');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleFactory}
     */
    var AnnotationModuleFactory = Class.extend(ModuleFactory, {

        _name: "bugioc.AnnotationModuleFactory",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         * @param {IocModule} iocModule
         * @param {Class} moduleClass
         */
        _constructor: function(iocContext, iocModule, moduleClass) {

            this._super(iocContext, iocModule);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Class}
             */
            this.moduleClass = moduleClass;
        },


        //-------------------------------------------------------------------------------
        // ModuleFactory Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        factoryModule: function() {
            var moduleArgs      = this.buildModuleArgs();
            return this.moduleClass.newInstance(moduleArgs);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.AnnotationModuleFactory', AnnotationModuleFactory);
});
