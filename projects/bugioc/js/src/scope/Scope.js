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
     * @return {*}
     */
    generateModule: function() {

    },

    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {*}
     */
    createModule: function() {
        var _this           = this;
        var configuration   = this.iocContext.findConfigurationByIocModule(this.iocModule);
        var args            = [];
        var iocArgList       = this.iocModule.getIocArgList();
        iocArgList.forEach(function(iocArg) {
            var refModule = _this.iocContext.generateModuleByName(iocArg.getRef());
            args.push(refModule);
        });

        var moduleMethod = configuration[this.iocModule.getMethodName()];
        if (!moduleMethod) {
            throw new Error("Cannot find module method in configuration that matches '" + this.iocModule.getMethodName() + "'");
        }
        var module = configuration[this.iocModule.getMethodName()].apply(configuration, args);

        var iocPropertySet = this.iocModule.getIocPropertySet();
        iocPropertySet.forEach(function(iocProperty) {
            module[iocProperty.getName()] = _this.iocContext.generateModuleByName(iocProperty.getRef());
        });
        return module;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.Scope', Scope);
