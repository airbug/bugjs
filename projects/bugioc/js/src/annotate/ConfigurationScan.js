//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ConfigurationScan')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredScan')
//@Require('bugioc.IocArg')
//@Require('bugioc.IocConfiguration')
//@Require('bugioc.IocModule')
//@Require('bugioc.IocProperty')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Map =               bugpack.require('Map');
var Obj =               bugpack.require('Obj');
var Annotate =          bugpack.require('annotate.Annotate');
var AutowiredScan =     bugpack.require('bugioc.AutowiredScan');
var IocArg =            bugpack.require('bugioc.IocArg');
var IocConfiguration =  bugpack.require('bugioc.IocConfiguration');
var IocModule =         bugpack.require('bugioc.IocModule');
var IocProperty =       bugpack.require('bugioc.IocProperty');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConfigurationScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {ApplicationContext} applicationContext
     */
    _constructor: function(applicationContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ApplicationContext}
         */
        this.applicationContext = applicationContext;

        /**
         * @private
         * @type {AutowiredScan}
         */
        this.autowiredScan = new AutowiredScan(applicationContext);

        /**
         * @private
         * @type {Map<Class, IocConfiguration>}
         */
        this.configurationClassToIocConfigurationMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    scan: function() {
        var _this = this;
        this.autowiredScan.scan();
        var configurationAnnotations = Annotate.getAnnotationsByType("Configuration");
        if (configurationAnnotations) {
            configurationAnnotations.forEach(function(annotation) {
                var configurationClass = annotation.getReference();
                var moduleAnnotationArray = annotation.getModules();
                _this.createIocConfiguration(configurationClass, moduleAnnotationArray);
            });
        }
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
     * @param {Class} configurationClass
     * @param {Array<ModuleAnnotation>} moduleAnnotationArray
     */
    createIocConfiguration: function(configurationClass, moduleAnnotationArray) {
        var _this = this;
        if (!this.configurationClassToIocConfigurationMap.containsKey(configurationClass)) {
            var iocConfiguration = new IocConfiguration(configurationClass);
            moduleAnnotationArray.forEach(function(moduleAnnotation) {
                var iocModule = _this.createIocModule(moduleAnnotation);
                iocConfiguration.addIocModule(iocModule)
            });
            this.configurationClassToIocConfigurationMap.put(configurationClass, iocConfiguration);
            this.applicationContext.registerIocConfiguration(iocConfiguration);
        }
    },

    /**
     * @private
     * @param {ModuleAnnotation} moduleAnnotation
     * @return {IocModule}
     */
    createIocModule: function(moduleAnnotation) {
        var _this = this;
        var iocModule = new IocModule(moduleAnnotation.getMethodName(), moduleAnnotation.getName(), moduleAnnotation.getScope());
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationScan', ConfigurationScan);
