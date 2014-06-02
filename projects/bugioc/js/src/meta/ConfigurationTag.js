//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ConfigurationTag')

//@Require('Class')
//@Require('bugioc.ModuleTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ModuleTag    = bugpack.require('bugioc.ModuleTag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleTag}
     */
    var ConfigurationTag = Class.extend(ModuleTag, {

        _name: "bugioc.ConfigurationTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} moduleName
         */
        _constructor: function(moduleName) {

            this._super(moduleName, ConfigurationTag.TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<ModuleTag>}
             */
            this.configurationModuleArray = [];
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<ModuleTag>}
         */
        getConfigurationModules: function() {
            return this.configurationModuleArray;
        },


        //-------------------------------------------------------------------------------
        // Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<ModuleTag>} configurationModuleArray
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
    ConfigurationTag.TYPE = "Configuration";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} moduleName
     * @return {ConfigurationTag}
     */
    ConfigurationTag.configuration = function(moduleName) {
        return new ConfigurationTag(moduleName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ConfigurationTag', ConfigurationTag);
});
