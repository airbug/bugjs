//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('Scope')

//@Require('Class')
//@Require('Obj')

var bugpack = require('bugpack');


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
         * @type {IOCModule}
         */
        this.iocModule = iocModule;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IOCModule}
     */
    getIOCModule: function() {
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
        var configuration = this.bugIOC.findConfigurationByIOCModule(this.iocModule);
        var args = [];
        var iocArgSet = this.iocModule.getIOCArgSet();
        iocArgSet.forEach(function(iocArg) {
            var refModule = _this.bugIOC.generateModuleByName(iocArg.getRef());
            args.push(refModule);
        });

        var module = configuration[this.iocModule.getMethodName()].apply(configuration, args);

        var iocPropertySet = this.iocModule.getIOCPropertySet();
        iocPropertySet.forEach(function(iocProperty) {
            module[iocProperty.getName()] = _this.bugIOC.generateModuleByName(iocProperty.getRef());
        });
        return module;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(Scope);
