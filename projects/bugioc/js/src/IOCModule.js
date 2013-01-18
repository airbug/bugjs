//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('IOCModule')

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

var IOCModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(methodName, name, scope) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set<IOCArg>}
         */
        this.iocArgSet = new Set();

        /**
         * @private
         * @type {IOCConfiguration}
         */
        this.iocConfiguration = null;

        /**
         * @private
         * @type {Set<IOCProperty>}
         */
        this.iocPropertySet = new Set();

        /**
         * @private
         * @type {string}
         */
        this.methodName = methodName;

        /**
         * @private
         * @type {string}
         */
        this.name = name;

        /**
         * @private
         * @type {IOCModule.Scope}
         */
        this.scope = scope ? scope : IOCModule.Scope.SINGLETON;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     *
     * @return {Set}
     */
    getIOCArgSet: function() {
        return this.iocArgSet;
    },

    /**
     * @retrurn {IOCConfiguration}
     */
    getIOCConfiguration: function() {
        return this.iocConfiguration;
    },

    /**
     * @param {IOCConfiguration} iocConfiguration
     */
    setIOCConfiguration: function(iocConfiguration) {
        this.iocConfiguration = iocConfiguration;
    },

    /**
     *
     * @return {Set}
     */
    getIOCPropertySet: function() {
        return this.iocPropertySet;
    },

    /**
     * @return {string}
     */
    getMethodName: function() {
        return this.methodName;
    },

    /**
     * @return {string}
     */
    getName: function() {
        return this.name;
    },

    /**
     * @return {IOCModule.Scope}
     */
    getScope: function() {
        return this.scope;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, IOCModule)) {
            return Obj.equals(value.getName(), this.getName());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[IOCModule]" + Obj.hashCode(this.name));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IOCArg} iocArg
     */
    addIOCArg: function(iocArg) {
        if (!this.iocArgSet.contains(iocArg)) {
            this.iocArgSet.add(iocArg);
        } else {
            throw new Error("Module already contains this IOCArg");
        }
    },

    /**
     * @param {IOCProperty} iocProperty
     */
    addIOCProperty: function(iocProperty) {
        if (!this.iocPropertySet.contains(iocProperty)) {
            this.iocPropertySet.add(iocProperty);
        } else {
            throw new Error("Module already contains this IOCProperty");
        }
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
IOCModule.Scope = {
    PROTOTYPE: "prototype",
    SINGLETON: "singleton"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.IOCModule', IOCModule);
