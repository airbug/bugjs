//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ConfigurationAnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.ConfigurationModuleFactory')
//@Require('bugioc.IocArg')
//@Require('bugioc.IocModule')
//@Require('bugioc.IocProperty')
//@Require('bugmeta.BugMeta')


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
var ConfigurationModuleFactory      = bugpack.require('bugioc.ConfigurationModuleFactory');
var IocArg                          = bugpack.require('bugioc.IocArg');
var IocModule                       = bugpack.require('bugioc.IocModule');
var IocProperty                     = bugpack.require('bugioc.IocProperty');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConfigurationAnnotationProcessor = Class.extend(Obj, {

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
        this.iocContext                             = iocContext;

        /**
         * @private
         * @type {}
         */
        this.processedConfigurationAnnotationSet    = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ConfigurationAnnotation} configurationAnnotation
     */
    process: function(configurationAnnotation) {
        this.processConfigurationAnnotation(configurationAnnotation);
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
        return new IocArg(argAnnotation.getRef());
    },

    /**
     * @private
     * @param {ModuleAnnotation} moduleAnnotation
     * @return {IocModule}
     */
    createIocModule: function(moduleAnnotation) {
        var _this = this;
        var iocModule = new IocModule(moduleAnnotation.getName(), moduleAnnotation.getScope());
        var argAnnotationArray = moduleAnnotation.getArgs();
        argAnnotationArray.forEach(function(argAnnotation) {
            var iocArg = _this.createIocArg(argAnnotation);
            iocModule.addIocArg(iocArg);
        });
        var propertyAnnotationArray = moduleAnnotation.getProperties();
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
        return new IocProperty(propertyAnnotation.getName(), propertyAnnotation.getRef());
    },

    /**
     * @private
     * @param {ConfigurationAnnotation} configurationAnnotation
     */
    processConfigurationAnnotation: function(configurationAnnotation) {
        var _this                   = this;
        if (!this.processedConfigurationAnnotationSet.contains(configurationAnnotation)) {
            var configurationClass      = configurationAnnotation.getReference();
            var moduleAnnotationArray   = configurationAnnotation.getModules();
            var configuration           = new configurationClass();

            moduleAnnotationArray.forEach(function(moduleAnnotation) {
                var iocModule   = _this.createIocModule(moduleAnnotation);
                var factory     = new ConfigurationModuleFactory(_this.iocContext, iocModule, configuration);
                iocModule.setModuleFactory(factory);
                _this.iocContext.registerIocModule(iocModule);
            });
            this.processedConfigurationAnnotationSet.add(configurationAnnotation);
            this.iocContext.registerConfiguration(configuration);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationAnnotationProcessor', ConfigurationAnnotationProcessor);
