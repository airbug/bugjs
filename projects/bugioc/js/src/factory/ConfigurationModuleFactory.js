//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ConfigurationModuleFactory')

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

var ConfigurationModuleFactory = Class.extend(ModuleFactory, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {IocContext} iocContext
     * @param {IocModule} iocModule
     * @param {IocModule} configurationIocModule
     */
    _constructor: function(iocContext, iocModule, configurationIocModule) {

        this._super(iocContext, iocModule);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocModule}
         */
        this.configurationIocModule = configurationIocModule;
    },


    //-------------------------------------------------------------------------------
    // ModuleFactory Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    factoryModule: function() {
        var configuration   = this.getIocContext().getModuleByName(this.configurationIocModule.getName());
        var moduleMethod    = configuration[this.getIocModule().getName()];
        if (!moduleMethod) {
            throw new Error("Cannot find module method in configuration that matches '" + this.getIocModule().getName() + "'");
        }
        var moduleArgs      = this.buildModuleArgs();
        return moduleMethod.apply(configuration, moduleArgs);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationModuleFactory', ConfigurationModuleFactory);
