//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ModuleTagProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.ClassModuleFactory')
//@Require('bugioc.IocArg')
//@Require('bugioc.IocModule')
//@Require('bugioc.IocProperty')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Obj                             = bugpack.require('Obj');
    var Set                             = bugpack.require('Set');
    var ClassModuleFactory         = bugpack.require('bugioc.ClassModuleFactory');
    var IocArg                          = bugpack.require('bugioc.IocArg');
    var IocModule                       = bugpack.require('bugioc.IocModule');
    var IocProperty                     = bugpack.require('bugioc.IocProperty');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ModuleTagProcessor = Class.extend(Obj, {

        _name: "bugioc.ModuleTagProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IocContext} iocContext
         */
        _constructor: function(iocContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext                     = iocContext;

            /**
             * @private
             * @type {Set.<ModuleTag>}
             */
            this.processedModuleTagSet   = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocContext}
         */
        getIocContext: function() {
            return this.iocContext;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ModuleTag} moduleTag
         */
        process: function(moduleTag) {
            this.processModuleTag(moduleTag);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {ModuleTag} moduleTag
         * @return {IocModule}
         */
        buildIocModule: function(moduleTag) {
            var moduleConstructor   = moduleTag.getTagReference();
            var moduleClass         = moduleConstructor.getClass();
            var iocModule           = this.factoryIocModule(moduleTag);
            var factory             = new ClassModuleFactory(this.iocContext, iocModule, moduleClass);
            iocModule.setModuleFactory(factory);
            this.iocContext.registerIocModule(iocModule);
            return iocModule;
        },

        /**
         * @protected
         * @param {ArgTag} argTag
         * @return {IocArg}
         */
        factoryIocArg: function(argTag) {
            return new IocArg(argTag.getArgRef(), argTag.getArgValue());
        },

        /**
         * @protected
         * @param {ModuleTag} moduleTag
         * @return {IocModule}
         */
        factoryIocModule: function(moduleTag) {
            var _this = this;
            var iocModule = new IocModule(moduleTag.getModuleName(), moduleTag.getModuleScope());
            var argTagArray = moduleTag.getModuleArgs();
            argTagArray.forEach(function(argTag) {
                var iocArg = _this.factoryIocArg(argTag);
                iocModule.addIocArg(iocArg);
            });
            var propertyTagArray = moduleTag.getModuleProperties();
            propertyTagArray.forEach(function(propertyTag) {
                var iocProperty = _this.factoryIocProperty(propertyTag);
                iocModule.addIocProperty(iocProperty);
            });
            return iocModule;
        },

        /**
         * @protected
         * @param {PropertyTag} propertyTag
         * @return {IocProperty}
         */
        factoryIocProperty: function(propertyTag) {
            return new IocProperty(propertyTag.getPropertyName(), propertyTag.getPropertyRef(), propertyTag.getPropertyValue());
        },

        /**
         * @protected
         * @param {ModuleTag} moduleTag
         */
        processModuleTag: function(moduleTag) {
            if (!this.processedModuleTagSet.contains(moduleTag)) {
                this.buildIocModule(moduleTag);
                this.processedModuleTagSet.add(moduleTag);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleTagProcessor', ModuleTagProcessor);
});
