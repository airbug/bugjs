//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Properties')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Properties = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertiesObject) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        if (!TypeUtil.isObject(propertiesObject) || !TypeUtil.toType(propertiesObject) === "Object") {
            throw new Error("propertiesObject must be a generic object");
        }
        this.propertiesObject = propertiesObject;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getPropertiesObject: function() {
        return this.propertiesObject;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} propertyName
     * @return {*}
     */
    getProperty: function(propertyName) {

        //NOTE BRN: We're trying to dig down in to the property object. So if we have a property Object like this
        // {
        //     name: {
        //         subName: "someValue"
        //     }
        // }
        // and we request a property named "name.subName", then "someValue" should be returned. If we request the property
        // "name" then the object {subName: "someValue"} will be returned.

        var parts = propertyName.split(".");
        var propertyValue = this.propertiesObject;
        for (var i = 0, size = parts.length; i < size; i++) {
            var part = parts[i];
            if (TypeUtil.isObject(propertyValue) && TypeUtil.toType(propertyValue) === "Object") {
                propertyValue = propertyValue[part];
            } else {
                return undefined;
            }
        }
        return propertyValue;
    },

    /**
     * @param {Array.<Properties>} arrayOfProperties
     */
    merge: function(arrayOfProperties) {
        for (var i = arrayOfProperties.length - 1; i >=0; i--) {
            var properties = arrayOfProperties[i];
            this.updateProperties(properties.getPropertiesObject());
        }
    },

    /**
     * @param {Object} propertiesObject
     */
    updateProperties: function(propertiesObject) {
        for (var name in propertiesObject) {
            var value = propertiesObject[name];
            this.updateProperty(name, value);
        }
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    updateProperty: function(propertyName, propertyValue) {
        var currentValue = this.getProperty(propertyName);
        if (TypeUtil.isObject(currentValue) && TypeUtil.toType(currentValue) === "Object" &&
            TypeUtil.isObject(propertyValue) && TypeUtil.toType(propertyValue) === "Object") {
            for (var name in propertyValue) {
                var subValue = propertyValue[name];
                var subName = propertyName + "." + name;
                this.updateProperty(subName, subValue);
            }
        } else {
            this.setProperty(propertyName, propertyValue);
        }
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        var parts = propertyName.split(".");
        if (parts.size > 1) {
            var subName = null;
            var currentValue = this.propertiesObject;
            var nextValue = null;
            for (var i = 0, size = parts.length; i < size; i++) {
                subName = parts[i];
                if (i === size - 1) {
                    currentValue[subName] = propertyValue;
                } else {
                    nextValue = currentValue[subName];
                    if (!(TypeUtil.isObject(nextValue) && TypeUtil.toType(nextValue) === "Object")) {
                        nextValue = currentValue[subName] = {};
                    }
                    currentValue = nextValue;
                }
            }
        } else {
            this.propertiesObject[propertyName] = propertyValue;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Properties', Properties);
