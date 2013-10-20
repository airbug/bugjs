//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ConfigurationAnnotationProcessor')

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
     * @param {IocContext} iocContext
     */
    _constructor: function(iocContext) {

        this._super(iocContext);


        //-------------------------------------------------------------------------------
        // Declare Variables
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
