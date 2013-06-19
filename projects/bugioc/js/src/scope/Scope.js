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

    _constructor: function(bugIOC, iocModule) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.bugIOC = bugIOC;

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
        var _this = this;
        var configuration = this.bugIOC.findConfigurationByIocModule(this.iocModule);
        var args = [];
        var iocArgSet = this.iocModule.getIocArgSet();
        iocArgSet.forEach(function(iocArg) {
            var refModule = _this.bugIOC.generateModuleByName(iocArg.getRef());
            args.push(refModule);
        });

        var moduleMethod = configuration[this.iocModule.getMethodName()];
        if (!moduleMethod) {
            throw new Error("Cannot find module method in configuration that matches '" + this.iocModule.getMethodName() + "'");
        }
        var module = configuration[this.iocModule.getMethodName()].apply(configuration, args);

        var iocPropertySet = this.iocModule.getIocPropertySet();
        iocPropertySet.forEach(function(iocProperty) {
            module[iocProperty.getName()] = _this.bugIOC.generateModuleByName(iocProperty.getRef());
        });
        return module;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.Scope', Scope);
