//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmarshaller')

//@Export('EntityAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Annotation = bugpack.require('bugmeta.Annotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(moduleMethodName) {

        this._super("Module");


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<ArgAnnotation>}
         */
        this.moduleArgs = [];

        /**
         * @private
         * @type {string}
         */
        this.moduleMethodName = moduleMethodName;

        /**
         * @private
         * @type {string}
         */
        this.moduleName = moduleMethodName;

        /**
         * @private
         * @type {Array<PropertyAnnotation>}
         */
        this.entityProperties = [];

        /**
         * @private
         * @type {ModuleAnnotation.Scope}
         */
        this.moduleScope = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<ArgAnnotation>}
     */
    getArgs: function() {
        return this.moduleArgs;
    },

    /**
     * @return {string}
     */
    getMethodName: function() {
        return this.moduleMethodName;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return this.moduleName;
    },

    /**
     * @return {Array<PropertyAnnotation>}
     */
    getProperties: function() {
        return this.moduleProperties;
    },

    /**
     * @return {ModuleAnnotation.Scope}
     */
    getScope: function() {
        return this.moduleScope;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<ArgAnnotation>} moduleArgs
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
     * @param {Array<PropertyAnnotation>} moduleProperties
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
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmarshaller.EntityAnnotation', EntityAnnotation);
