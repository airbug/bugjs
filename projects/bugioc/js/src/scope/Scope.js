//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('Scope')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Scope = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(iocContext, iocModule) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocContext}
         */
        this.iocContext = iocContext;

        /**
         * @private
         * @type {IocModule}
         */
        this.iocModule = iocModule;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IocModule}
     */
    getIocModule: function() {
        return this.iocModule;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {Array.<*>} moduleArgs
     * @return {*}
     */
    generateModule: function(moduleArgs) {

    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {*}
     */
    createModule: function(moduleArgs) {
        var _this           = this;
        var configuration   = this.iocContext.findConfigurationByIocModule(this.iocModule);
        var moduleMethod    = configuration[this.iocModule.getMethodName()];
        if (!moduleMethod) {
            throw new Error("Cannot find module method in configuration that matches '" + this.iocModule.getMethodName() + "'");
        }
        return = configuration[this.iocModule.getMethodName()].apply(configuration, moduleArgs);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.Scope', Scope);
