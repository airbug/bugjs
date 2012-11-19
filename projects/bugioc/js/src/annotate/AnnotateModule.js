//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('AnnotateModule')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotateModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(moduleMethodName) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<AnnotateArg>}
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
         * @type {Array<AnnotateProperty>}
         */
        this.moduleProperties = [];

        /**
         * @private
         * @type {AnnotateModule.Scope}
         */
        this.moduleScope = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<AnnotateArg>}
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
     * @return {Array<AnnotateProperty>}
     */
    getProperties: function() {
        return this.moduleProperties;
    },

    /**
     * @return {AnnotateModule.Scope}
     */
    getScope: function() {
        return this.moduleScope;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<AnnotateArg>} moduleArgs
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
     * @param {Array<AnnotateProperty>} moduleProperties
     */
    properties: function(moduleProperties) {
        this.moduleProperties = moduleProperties;
        return this;
    },

    /**
     * @param {AnnotateModule.Scope} methodScope
     */
    scope: function(methodScope) {
        this.moduleScope = methodScope;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {string} moduleMethodName
 * @return {AnnotateModule}
 */
AnnotateModule.module = function(moduleMethodName) {
    return new AnnotateModule(moduleMethodName);
};
