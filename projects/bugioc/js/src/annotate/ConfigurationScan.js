//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ConfigurationScan')

//@Require('Annotate')
//@Require('BugIOC')
//@Require('Class')
//@Require('IOCArg')
//@Require('IOCConfiguration')
//@Require('IOCModule')
//@Require('IOCProperty')
//@Require('Map')
//@Require('Obj')


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
