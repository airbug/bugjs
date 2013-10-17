o//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('IocConfiguration')

//@Require('Class')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj =   bugpack.require('Obj');
var Set =   bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IocConfiguration = Class.extend(Obj, {

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
         * @type {Set<IocModule>}
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
     * @return {Set<IocModule>}
     */
    getIocModuleSet: function() {
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
        if (Class.doesExtend(value, IocConfiguration)) {
            return Obj.equals(value.getConfigurationClass(), this.getConfigurationClass());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[IocConfiguration]" + Obj.hashCode(this.configurationClass));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IocModule} iocModule
     */
    addIocModule: function(iocModule) {
        if (!this.iocModuleSet.contains(iocModule)) {
            this.iocModuleSet.add(iocModule);
            iocModule.setIocConfiguration(this);
        } else {
            throw new Error("Configuration already contains an IocModule by this name");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.IocConfiguration', IocConfiguration);
