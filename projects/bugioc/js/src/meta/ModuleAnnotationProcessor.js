//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ModuleAnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.AnnotationModuleFactory')
//@Require('bugioc.IocArg')
//@Require('bugioc.IocModule')
//@Require('bugioc.IocProperty')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var Set                             = bugpack.require('Set');
var AnnotationModuleFactory         = bugpack.require('bugioc.AnnotationModuleFactory');
var IocArg                          = bugpack.require('bugioc.IocArg');
var IocModule                       = bugpack.require('bugioc.IocModule');
var IocProperty                     = bugpack.require('bugioc.IocProperty');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ModuleAnnotationProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {IocContext} iocContext
     */
    _constructor: function(iocContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocContext}
         */
        this.iocContext                     = iocContext;

        /**
         * @private
         * @type {}
         */
        this.processedModuleAnnotationSet   = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ModuleAnnotation} moduleAnnotation
     */
    process: function(moduleAnnotation) {
        this.processModuleAnnotation(moduleAnnotation);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ArgAnnotation} argAnnotation
     * @return {IocArg}
     */
    createIocArg: function(argAnnotation) {
        return new IocArg(argAnnotation.getArgRef());
    },

    /**
     * @private
     * @param {ModuleAnnotation} moduleAnnotation
     * @return {IocModule}
     */
    createIocModule: function(moduleAnnotation) {
        var _this = this;
        var iocModule = new IocModule(moduleAnnotation.getModuleName(), moduleAnnotation.getModuleScope());
        var argAnnotationArray = moduleAnnotation.getModuleArgs();
        argAnnotationArray.forEach(function(argAnnotation) {
            var iocArg = _this.createIocArg(argAnnotation);
            iocModule.addIocArg(iocArg);
        });
        var propertyAnnotationArray = moduleAnnotation.getModuleProperties();
        propertyAnnotationArray.forEach(function(propertyAnnotation) {
            var iocProperty = _this.createIocProperty(propertyAnnotation);
            iocModule.addIocProperty(iocProperty);
        });
        return iocModule;
    },

    /**
     * @private
     * @param {PropertyAnnotation} propertyAnnotation
     * @return {IocProperty}
     */
    createIocProperty: function(propertyAnnotation) {
        return new IocProperty(propertyAnnotation.getPropertyName(), propertyAnnotation.getPropertyRef());
    },

    /**
     * @private
     * @param {ModuleAnnotation} moduleAnnotation
     */
    processModuleAnnotation: function(moduleAnnotation) {
        if (!this.processedModuleAnnotationSet.contains(moduleAnnotation)) {
            var moduleClass     = moduleAnnotation.getAnnotationReference();
            var iocModule       = this.createIocModule(moduleAnnotation);
            var factory         = new AnnotationModuleFactory(this.iocContext, iocModule, moduleClass);
            iocModule.setModuleFactory(factory);
            this.iocContext.registerIocModule(iocModule);
            this.processedModuleAnnotationSet.add(moduleAnnotation);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ModuleAnnotationProcessor', ModuleAnnotationProcessor);
