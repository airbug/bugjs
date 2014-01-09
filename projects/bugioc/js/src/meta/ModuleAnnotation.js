//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ModuleAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Annotation      = bugpack.require('bugmeta.Annotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ModuleAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(moduleName, annotationType) {

        annotationType = annotationType ? annotationType : ModuleAnnotation.TYPE;
        this._super(annotationType);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<ArgAnnotation>}
         */
        this.moduleArgs         = [];

        /**
         * @private
         * @type {string}
         */
        this.moduleName         = moduleName;

        /**
         * @private
         * @type {Array.<PropertyAnnotation>}
         */
        this.moduleProperties   = [];

        /**
         * @private
         * @type {ModuleAnnotation.Scope}
         */
        this.moduleScope        = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array.<ArgAnnotation>}
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
     * @return {Array.<PropertyAnnotation>}
     */
    getModuleProperties: function() {
        return this.moduleProperties;
    },

    /**
     * @return {ModuleAnnotation.Scope}
     */
    getModuleScope: function() {
        return this.moduleScope;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<ArgAnnotation>} moduleArgs
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
     * @param {Array.<PropertyAnnotation>} moduleProperties
     */
    properties: function(moduleProperties) {
        this.moduleProperties = moduleProperties;
        return this;
    },

    /**
     * @param {ModuleAnnotation.Scope} methodScope
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
ModuleAnnotation.TYPE = "Module";


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {string} moduleName
 * @return {ModuleAnnotation}
 */
ModuleAnnotation.module = function(moduleName) {
    return new ModuleAnnotation(moduleName);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ModuleAnnotation', ModuleAnnotation);
