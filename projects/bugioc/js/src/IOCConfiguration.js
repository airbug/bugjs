//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('IOCConfiguration')

//@Require('Class')
//@Require('Obj')
//@Require('Set')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('IOCConfiguration');

var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');
var Set = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IOCConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(configurationClass) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Class}
         */
        this.configurationClass = configurationClass;

        /**
         * @private
         * @type {Set<IOCModule>}
         */
        this.iocModuleSet = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getConfigurationClass: function() {
        return this.configurationClass;
    },

    /**
     * @return {Set<IOCModule>}
     */
    getIOCModuleSet: function() {
        return this.iocModuleSet;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, IOCConfiguration)) {
            return Obj.equals(value.getConfigurationClass(), this.getConfigurationClass());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[IOCConfiguration]" + Obj.hashCode(this.configurationClass));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IOCModule} iocModule
     */
    addIOCModule: function(iocModule) {
        if (!this.iocModuleSet.contains(iocModule)) {
            this.iocModuleSet.add(iocModule);
            iocModule.setIOCConfiguration(this);
        } else {
            throw new Error("Configuration already contains an IOCModule by this name");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(IOCConfiguration);
