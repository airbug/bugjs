//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('ModuleFactory')

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
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @return {*}
     */
    factoryModule: function() {

    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
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
            var refModule = _this.iocContext.getModuleByName(iocArg.getRef());
            moduleArgs.push(refModule);
        });
        return moduleArgs;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.ModuleFactory', ModuleFactory);
