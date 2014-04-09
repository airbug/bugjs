//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.ModuleFactory')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ModuleFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {IocContext} iocContext
     * @param {IocModule} iocModule
     */
    _constructor: function(iocContext, iocModule) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IocContext}
         */
        this.iocContext     = iocContext;

        /**
         * @private
         * @type {IocModule}
         */
        this.iocModule      = iocModule;
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

    /**
     * @return {IocModule}
     */
    getIocModule: function() {
        return this.iocModule;
    },


    //-------------------------------------------------------------------------------
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @return {*}
     */
    factoryModule: function() {

    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {Array.<*>}
     */
    buildModuleArgs: function() {
        var _this           = this;
        var moduleArgs      = [];
        var iocArgList      = this.iocModule.getIocArgList();
        iocArgList.forEach(function(iocArg) {
            if (iocArg.getRef()) {
                var refModule = _this.iocContext.getModuleByName(iocArg.getRef());
                moduleArgs.push(refModule);
            } else {
                moduleArgs.push(iocArg.getValue());
            }
        });
        return moduleArgs;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ModuleFactory', ModuleFactory);
