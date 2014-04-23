//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ModuleAnnotationProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.AnnotationModuleFactory')
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
    var AnnotationModuleFactory         = bugpack.require('bugioc.AnnotationModuleFactory');
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
    var ModuleAnnotationProcessor = Class.extend(Obj, {

        _name: "bugioc.ModuleAnnotationProcessor",


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
             * @type {Set.<ModuleAnnotation>}
             */
            this.processedModuleAnnotationSet   = new Set();
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
         * @param {ModuleAnnotation} moduleAnnotation
         */
        process: function(moduleAnnotation) {
            this.processModuleAnnotation(moduleAnnotation);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {ModuleAnnotation} moduleAnnotation
         * @return {IocModule}
         */
        buildIocModule: function(moduleAnnotation) {
            var moduleConstructor   = moduleAnnotation.getAnnotationReference();
            var moduleClass         = moduleConstructor.getClass();
            var iocModule           = this.factoryIocModule(moduleAnnotation);
            var factory             = new AnnotationModuleFactory(this.iocContext, iocModule, moduleClass);
            iocModule.setModuleFactory(factory);
            this.iocContext.registerIocModule(iocModule);
            return iocModule;
        },

        /**
         * @protected
         * @param {ArgAnnotation} argAnnotation
         * @return {IocArg}
         */
        factoryIocArg: function(argAnnotation) {
            return new IocArg(argAnnotation.getArgRef(), argAnnotation.getArgValue());
        },

        /**
         * @protected
         * @param {ModuleAnnotation} moduleAnnotation
         * @return {IocModule}
         */
        factoryIocModule: function(moduleAnnotation) {
            var _this = this;
            var iocModule = new IocModule(moduleAnnotation.getModuleName(), moduleAnnotation.getModuleScope());
            var argAnnotationArray = moduleAnnotation.getModuleArgs();
            argAnnotationArray.forEach(function(argAnnotation) {
                var iocArg = _this.factoryIocArg(argAnnotation);
                iocModule.addIocArg(iocArg);
            });
            var propertyAnnotationArray = moduleAnnotation.getModuleProperties();
            propertyAnnotationArray.forEach(function(propertyAnnotation) {
                var iocProperty = _this.factoryIocProperty(propertyAnnotation);
                iocModule.addIocProperty(iocProperty);
            });
            return iocModule;
        },

        /**
         * @protected
         * @param {PropertyAnnotation} propertyAnnotation
         * @return {IocProperty}
         */
        factoryIocProperty: function(propertyAnnotation) {
            return new IocProperty(propertyAnnotation.getPropertyName(), propertyAnnotation.getPropertyRef(), propertyAnnotation.getPropertyValue());
        },

        /**
         * @protected
         * @param {ModuleAnnotation} moduleAnnotation
         */
        processModuleAnnotation: function(moduleAnnotation) {
            if (!this.processedModuleAnnotationSet.contains(moduleAnnotation)) {
                this.buildIocModule(moduleAnnotation);
                this.processedModuleAnnotationSet.add(moduleAnnotation);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleAnnotationProcessor', ModuleAnnotationProcessor);
});
