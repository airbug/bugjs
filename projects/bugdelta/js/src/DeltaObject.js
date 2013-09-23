//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('DeltaObject')

//@Require('Class')
//@Require('IClone')
//@Require('IObjectable')
//@Require('LiteralUtil')
//@Require('Map')
//@Require('Obj')
//@Require('bugdelta.PropertyChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IClone              = bugpack.require('IClone');
var IObjectable         = bugpack.require('IObjectable');
var LiteralUtil         = bugpack.require('LiteralUtil');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var PropertyChange      = bugpack.require('bugdelta.PropertyChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DeltaObject = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, PropertyChange>}
         */
        this.propertyChangeMap      = new Map();

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.propertyMap            = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, PropertyChange>}
     */
    getPropertyChangeMap: function() {
        return this.propertyChangeMap;
    },

    /**
     * @return {Map.<string, *>}
     */
    getPropertyMap: function() {
        return this.propertyMap;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {

        // TODO BRN: Implement "deep" cloning

        var cloneDeltaObject = new DeltaObject();
        cloneDeltaObject.getPropertyChangeMap().putAll(this.getPropertyChangeMap());
        cloneDeltaObject.getPropertyMap().putAll(this.getPropertyMap());
        return cloneDeltaObject;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var obj = {};
        this.propertyMap.forEach(function(value, key) {
            obj[key] = LiteralUtil.convertToLiteral(value);
        });
        return obj;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commitPropertyChanges: function() {
        var _this = this;
        this.propertyChangeMap.forEach(function(propertyChange) {
            switch (propertyChange.getChangeType()) {
                case PropertyChange.ChangeTypes.PROPERTY_REMOVED:
                    _this.propertyMap.remove(propertyChange.getPropertyName());
                    break;
                case PropertyChange.ChangeTypes.PROPERTY_SET:
                    var propertyName    = propertyChange.getPropertyName();
                    var propertyValue   = propertyChange.getPropertyValue();
                    _this.propertyMap.put(propertyName, propertyValue);
                    break;
            }
        });
        this.propertyChangeMap.clear();
    },

    /**
     * @param {string} propertyName
     * @return {*}
     */
    getProperty: function(propertyName) {
        var propertyValue = undefined;
        if (this.propertyChangeMap.containsKey(propertyName)) {
            var propertyChange = this.propertyChangeMap.get(propertyName);
            switch (propertyChange.getChangeType()) {
                case PropertyChange.ChangeTypes.PROPERTY_REMOVED:
                    //do nothing
                    break;
                case PropertyChange.ChangeTypes.PROPERTY_SET:
                    propertyValue = propertyChange.getPropertyValue();
                    break;
            }
        } else {
            propertyValue = this.propertyMap.get(propertyName);
        }
        return propertyValue;
    },

    /**
     * @param {string} propertyName
     */
    removeProperty: function(propertyName) {
        var previousValue = this.propertyMap.get(propertyName);
        var propertyChange = new PropertyChange(PropertyChange.ChangeTypes.PROPERTY_REMOVED, propertyName,
            previousValue);
        this.propertyChangeMap.put(propertyName, propertyChange);
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        var previousValue = this.propertyMap.get(propertyName);
        var propertyChange = new PropertyChange(PropertyChange.ChangeTypes.PROPERTY_SET, propertyName,
            previousValue, propertyValue);
        this.propertyChangeMap.put(propertyName, propertyChange);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(DeltaObject, IClone);
Class.implement(DeltaObject, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.DeltaObject', DeltaObject);
