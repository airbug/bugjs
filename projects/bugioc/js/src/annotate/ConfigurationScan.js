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
//@Require('bugioc.BugIOC')
//@Require('bugioc.IOCArg')
//@Require('bugioc.IOCConfiguration')
//@Require('bugioc.IOCModule')
//@Require('bugioc.IOCProperty')


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
var BugIOC =            bugpack.require('bugioc.BugIOC');
var IOCArg =            bugpack.require('bugioc.IOCArg');
var IOCConfiguration =  bugpack.require('bugioc.IOCConfiguration');
var IOCModule =         bugpack.require('bugioc.IOCModule');
var IOCProperty =       bugpack.require('bugioc.IOCProperty');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConfigurationScan = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        /**
         * @private
         * @type {AutowiredScan}
         */
        this.autowiredScan = new AutowiredScan();

        /**
         * @private
         * @type {Map<Class, IOCConfiguration>}
         */
        this.configurationClassToIOCConfigurationMap = new Map();
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
                _this.createIOCConfiguration(configurationClass, moduleAnnotationArray);
            });
            BugIOC.process();
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ArgAnnotation} argAnnotation
     * @return {IOCArg}
     */
    createIOCArg: function(argAnnotation) {
        return new IOCArg(argAnnotation.getRef());
    },

    /**
     * @private
     * @param {Class} configurationClass
     * @param {Array<ModuleAnnotation>} moduleAnnotationArray
     */
    createIOCConfiguration: function(configurationClass, moduleAnnotationArray) {
        var _this = this;
        if (!this.configurationClassToIOCConfigurationMap.containsKey(configurationClass)) {
            var iocConfiguration = new IOCConfiguration(configurationClass);
            moduleAnnotationArray.forEach(function(moduleAnnotation) {
                var iocModule = _this.createIOCModule(moduleAnnotation);
                iocConfiguration.addIOCModule(iocModule)
            });
            this.configurationClassToIOCConfigurationMap.put(configurationClass, iocConfiguration);
            BugIOC.registerIOCConfiguration(iocConfiguration);
        }
    },

    /**
     * @private
     * @param {ModuleAnnotation} moduleAnnotation
     * @return {IOCModule}
     */
    createIOCModule: function(moduleAnnotation) {
        var _this = this;
        var iocModule = new IOCModule(moduleAnnotation.getMethodName(), moduleAnnotation.getName(), moduleAnnotation.getScope());
        var argAnnotationArray = moduleAnnotation.getArgs();
        argAnnotationArray.forEach(function(argAnnotation) {
            var iocArg = _this.createIOCArg(argAnnotation);
            iocModule.addIOCArg(iocArg);
        });
        var propertyAnnotationArray = moduleAnnotation.getProperties();
        propertyAnnotationArray.forEach(function(propertyAnnotation) {
            var iocProperty = _this.createIOCProperty(propertyAnnotation);
            iocModule.addIOCProperty(iocProperty);
        });
        return iocModule;
    },

    /**
     * @private
     * @param {PropertyAnnotation} propertyAnnotation
     * @return {IOCProperty}
     */
    createIOCProperty: function(propertyAnnotation) {
        return new IOCProperty(propertyAnnotation.getName(), propertyAnnotation.getRef());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationScan', ConfigurationScan);
