//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmarkup.Component')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugmarkup.PropertyChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var UuidGenerator       = bugpack.require('UuidGenerator');
var PropertyChange      = bugpack.require('bugmarkup.PropertyChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Component = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(componentUuid, componentName) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.componentName  = componentName;

        /**
         * @private
         * @type {string}
         */
        this.componentUuid  = componentUuid || UuidGenerator.generateUuid();

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.propertyMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getComponentName: function() {
        return this.componentName;
    },

    /**
     * @return {string}
     */
    getComponentUuid: function() {
        return this.componentUuid;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} propertyName
     * @return {*}
     */
    getProperty: function(propertyName) {
        return this.propertyMap.get(propertyName);
    },

    /**
     *
     * @param propertyName
     * @param propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        var previousValue = this.propertyMap.get(propertyName);
        if (!Obj.equals(previousValue, propertyValue)) {
            this.propertyMap.put(propertyName, propertyValue);
            var propertyChange = new PropertyChange(propertyName, propertyValue, previousValue);
            this.dispatchEvent(new Event(Component.EventTypes.PROPERTY_CHANGED, {
                propertyChange: propertyChange
            }));
        }
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Component.EventTypes = {
    PROPERTY_CHANGED: "Component:PropertyChange"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmarkup.Component', Component);
