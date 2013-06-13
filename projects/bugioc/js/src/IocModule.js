//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('IocModule')

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

var IocModule = Class.extend(Obj, {

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
         * @type {Set<IocArg>}
         */
        this.iocArgSet = new Set();

        /**
         * @private
         * @type {IocConfiguration}
         */
        this.iocConfiguration = null;

        /**
         * @private
         * @type {Set<IocProperty>}
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
         * @type {IocModule.Scope}
         */
        this.scope = scope ? scope : IocModule.Scope.SINGLETON;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     *
     * @return {Set}
     */
    getIocArgSet: function() {
        return this.iocArgSet;
    },

    /**
     * @retrurn {IocConfiguration}
     */
    getIocConfiguration: function() {
        return this.iocConfiguration;
    },

    /**
     * @param {IocConfiguration} iocConfiguration
     */
    setIocConfiguration: function(iocConfiguration) {
        this.iocConfiguration = iocConfiguration;
    },

    /**
     *
     * @return {Set}
     */
    getIocPropertySet: function() {
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
     * @return {IocModule.Scope}
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
        if (Class.doesExtend(value, IocModule)) {
            return Obj.equals(value.getName(), this.getName());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[IocModule]" + Obj.hashCode(this.name));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IocArg} iocArg
     */
    addIocArg: function(iocArg) {
        if (!this.iocArgSet.contains(iocArg)) {
            this.iocArgSet.add(iocArg);
        } else {
            throw new Error("Module already contains this IocArg");
        }
    },

    /**
     * @param {IocProperty} iocProperty
     */
    addIocProperty: function(iocProperty) {
        if (!this.iocPropertySet.contains(iocProperty)) {
            this.iocPropertySet.add(iocProperty);
        } else {
            throw new Error("Module already contains this IocProperty");
        }
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
IocModule.Scope = {
    PROTOTYPE: "prototype",
    SINGLETON: "singleton"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugioc.IocModule', IocModule);