//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ConfigurationAnnotationProcessor')

//@Require('Class')
//@Require('Set')
//@Require('bugioc.ConfigurationModuleFactory')
//@Require('bugioc.ModuleAnnotationProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Set                             = bugpack.require('Set');
var ModuleAnnotationProcessor       = bugpack.require('bugioc.ModuleAnnotationProcessor');
var ConfigurationModuleFactory      = bugpack.require('bugioc.ConfigurationModuleFactory');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConfigurationAnnotationProcessor = Class.extend(ModuleAnnotationProcessor, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {IocContext} iocContext
     */
    _constructor: function(iocContext) {

        this._super(iocContext);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

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
     * @param {ConfigurationAnnotation} configurationAnnotation
     */
    processConfigurationAnnotation: function(configurationAnnotation) {
        var _this                   = this;
        if (!this.processedConfigurationAnnotationSet.contains(configurationAnnotation)) {
            var configurationIocModule  = this.buildIocModule(configurationAnnotation);
            var moduleAnnotationArray   = configurationAnnotation.getConfigurationModules();
            moduleAnnotationArray.forEach(function(moduleAnnotation) {
                var iocModule   = _this.factoryIocModule(moduleAnnotation);
                var factory     = new ConfigurationModuleFactory(_this.getIocContext(), iocModule, configurationIocModule);
                iocModule.setModuleFactory(factory);
                _this.getIocContext().registerIocModule(iocModule);
            });
            this.getIocContext().registerConfigurationIocModule(configurationIocModule);
            this.processedConfigurationAnnotationSet.add(configurationAnnotation);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationAnnotationProcessor', ConfigurationAnnotationProcessor);
