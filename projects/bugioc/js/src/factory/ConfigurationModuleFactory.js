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
     * @param {IocContext} iocContext
     * @param {IocModule} iocModule
     * @param {*} configuration
     */
    _constructor: function(iocContext, iocModule, configuration) {

        this._super(iocContext, iocModule);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.configuration = configuration;
    },


    //-------------------------------------------------------------------------------
    // ModuleFactory Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    factoryModule: function() {
        var moduleMethod    = this.configuration[this.iocModule.getName()];
        if (!moduleMethod) {
            throw new Error("Cannot find module method in configuration that matches '" + this.iocModule.getName() + "'");
        }
        var moduleArgs      = this.buildModuleArgs();
        return moduleMethod.apply(this.configuration, moduleArgs);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationModuleFactory', ConfigurationModuleFactory);
