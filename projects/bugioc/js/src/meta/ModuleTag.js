//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ModuleTag')

//@Require('Class')
//@Require('bugmeta.Tag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Tag      = bugpack.require('bugmeta.Tag');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Tag}
     */
    var ModuleTag = Class.extend(Tag, {

        _name: "bugioc.ModuleTag",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} moduleName
         * @param {string} annotationType
         */
        _constructor: function(moduleName, annotationType) {

            annotationType = annotationType ? annotationType : ModuleTag.TYPE;
            this._super(annotationType);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<ArgTag>}
             */
            this.moduleArgs         = [];

            /**
             * @private
             * @type {string}
             */
            this.moduleName         = moduleName;

            /**
             * @private
             * @type {Array.<PropertyTag>}
             */
            this.moduleProperties   = [];

            /**
             * @private
             * @type {ModuleTag.Scope}
             */
            this.moduleScope        = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<ArgTag>}
         */
        getModuleArgs: function() {
            return this.moduleArgs;
        },

        /**
         * @return {string}
         */
        getModuleName: function() {
            return this.moduleName;
        },

        /**
         * @return {Array.<PropertyTag>}
         */
        getModuleProperties: function() {
            return this.moduleProperties;
        },

        /**
         * @return {ModuleTag.Scope}
         */
        getModuleScope: function() {
            return this.moduleScope;
        },


        //-------------------------------------------------------------------------------
        // Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<ArgTag>} moduleArgs
         */
        args: function(moduleArgs) {
            this.moduleArgs = moduleArgs;
            return this;
        },

        /**
         * @param {string} moduleName
         */
        name: function(moduleName) {
            this.moduleName = moduleName;
            return this;
        },

        /**
         * @param {Array.<PropertyTag>} moduleProperties
         */
        properties: function(moduleProperties) {
            this.moduleProperties = moduleProperties;
            return this;
        },

        /**
         * @param {ModuleTag.Scope} methodScope
         */
        scope: function(methodScope) {
            this.moduleScope = methodScope;
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
    ModuleTag.TYPE = "Module";


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} moduleName
     * @return {ModuleTag}
     */
    ModuleTag.module = function(moduleName) {
        return new ModuleTag(moduleName);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugioc.ModuleTag', ModuleTag);
});
