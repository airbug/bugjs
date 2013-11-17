//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('AnnotationModuleFactory')

//@Require('Class')
//@Require('bugioc.ModuleFactory')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ModuleFactory       = bugpack.require('bugioc.ModuleFactory');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotationModuleFactory = Class.extend(ModuleFactory, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
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
        this.moduleClass    = moduleClass;
    },


    //-------------------------------------------------------------------------------
    // ModuleFactory Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    factoryModule: function() {
        var moduleArgs      = this.buildModuleArgs();
        return this.moduleClass.create(moduleArgs);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.AnnotationModuleFactory', AnnotationModuleFactory);
