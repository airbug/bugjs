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
                var annotateModuleList = annotation.getParamList();
                _this.createIOCConfiguration(configurationClass, annotateModuleList);
            });
            BugIOC.process();
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {AnnotateArg} annotateArg
     * @return {IOCArg}
     */
    createIOCArg: function(annotateArg) {
        return new IOCArg(annotateArg.getRef());
    },

    /**
     * @private
     * @param {Class} configurationClass
     * @param {List<AnnotateModule>} annotateModuleList
     */
    createIOCConfiguration: function(configurationClass, annotateModuleList) {
        var _this = this;
        if (!this.configurationClassToIOCConfigurationMap.containsKey(configurationClass)) {
            var iocConfiguration = new IOCConfiguration(configurationClass);
            annotateModuleList.forEach(function(annotateModule) {
                var iocModule = _this.createIOCModule(annotateModule);
                iocConfiguration.addIOCModule(iocModule)
            });
            this.configurationClassToIOCConfigurationMap.put(configurationClass, iocConfiguration);
            BugIOC.registerIOCConfiguration(iocConfiguration);
        }
    },

    /**
     * @private
     * @param {AnnotateModule} annotateModule
     * @return {IOCModule}
     */
    createIOCModule: function(annotateModule) {
        var _this = this;
        var iocModule = new IOCModule(annotateModule.getMethodName(), annotateModule.getName(), annotateModule.getScope());
        var annotateArgArray = annotateModule.getArgs();
        annotateArgArray.forEach(function(annotateArg) {
            var iocArg = _this.createIOCArg(annotateArg);
            iocModule.addIOCArg(iocArg);
        });
        var annotatePropertyArray = annotateModule.getProperties();
        annotatePropertyArray.forEach(function(annotateProperty) {
            var iocProperty = _this.createIOCProperty(annotateProperty);
            iocModule.addIOCProperty(iocProperty);
        });
        return iocModule;
    },

    /**
     * @private
     * @param {AnnotateProperty} annotateProperty
     * @return {IOCProperty}
     */
    createIOCProperty: function(annotateProperty) {
        return new IOCProperty(annotateProperty.getName(), annotateProperty.getRef());
    }
});
