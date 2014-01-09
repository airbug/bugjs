//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ConfigurationAnnotation')

//@Require('Class')
//@Require('bugioc.ModuleAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConfigurationAnnotation = Class.extend(ModuleAnnotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(moduleName) {

        this._super(moduleName, ConfigurationAnnotation.TYPE);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<ModuleAnnotation>}
         */
        this.configurationModuleArray = [];
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array.<ModuleAnnotation>}
     */
    getConfigurationModules: function() {
        return this.configurationModuleArray;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<ModuleAnnotation>} configurationModuleArray
     */
    modules: function(configurationModuleArray) {
        this.configurationModuleArray = configurationModuleArray;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
ConfigurationAnnotation.TYPE = "Configuration";


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} moduleName
 * @return {ConfigurationAnnotation}
 */
ConfigurationAnnotation.configuration = function(moduleName) {
    return new ConfigurationAnnotation(moduleName);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ConfigurationAnnotation', ConfigurationAnnotation);
