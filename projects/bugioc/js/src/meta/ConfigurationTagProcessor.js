//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ConfigurationTagProcessor')

//@Require('Class')
//@Require('Set')
//@Require('bugioc.ConfigurationModuleFactory')
//@Require('bugioc.ModuleTagProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Set                             = bugpack.require('Set');
    var ModuleTagProcessor       = bugpack.require('bugioc.ModuleTagProcessor');
    var ConfigurationModuleFactory      = bugpack.require('bugioc.ConfigurationModuleFactory');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ModuleTagProcessor}
     */
    var ConfigurationTagProcessor = Class.extend(ModuleTagProcessor, {

        _name: "bugioc.ConfigurationTagProcessor",


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
             * @type {Set.<ConfigurationTag>}
             */
            this.processedConfigurationTagSet    = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ConfigurationTag} configurationTag
         */
        process: function(configurationTag) {
            this.processConfigurationTag(configurationTag);
        },


        //-------------------------------------------------------------------------------
        // Private Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ConfigurationTag} configurationTag
         */
        processConfigurationTag: function(configurationTag) {
            var _this                   = this;
            if (!this.processedConfigurationTagSet.contains(configurationTag)) {
                var configurationIocModule  = this.buildIocModule(configurationTag);
                var moduleTagArray   = configurationTag.getConfigurationModules();
                moduleTagArray.forEach(function(moduleTag) {
                    var iocModule   = _this.factoryIocModule(moduleTag);
                    var factory     = new ConfigurationModuleFactory(_this.getIocContext(), iocModule, configurationIocModule);
                    iocModule.setModuleFactory(factory);
                    _this.getIocContext().registerIocModule(iocModule);
                });
                this.getIocContext().registerConfigurationIocModule(configurationIocModule);
                this.processedConfigurationTagSet.add(configurationTag);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ConfigurationTagProcessor', ConfigurationTagProcessor);
});
