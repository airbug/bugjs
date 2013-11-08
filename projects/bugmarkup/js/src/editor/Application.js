//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmarkup')

//@Export('Application')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('MultiSetMap')
//@Require('Obj')


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
var MultiSetMap         = bugpack.require('MultiSetMap');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Application = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, Component>}
         */
        this.componentUuidToComponentMap        = new Map();

        /**
         * @private
         * @type {MultiSetMap.<string, Component>}
         */
        this.componentNameToComponentMap        = new MultiSetMap();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Component} component
     */
    addComponent: function(component) {
        if (!this.componentUuidToComponentMap.containsKey(component.getComponentUuid())) {
            this.componentNameToComponentMap.put(component.getComponentName(), component);
            this.componentUuidToComponentMap.put(component.getComponentUuid(), component);
            this.dispatchEvent(new Event(Application.EventTypes.COMPONENT_ADDED, {
                component: component
            }));
        } else {
            throw new Error("Application already contains component with the uuid '" + component.getComponentUuid() + "'");
        }
    },

    /**
     * @param {string} componentUuid
     * @return {Component}
     */
    getComponentByUuid: function(componentUuid) {
        return this.componentUuidToComponentMap.get(componentUuid);
    },

    /**
     * @param {string} componentName
     * @return {Set.<Component>}
     */
    getComponentSetByName: function(componentName) {
        return this.componentNameToComponentMap.get(componentName);
    },

    /**
     * @param {string} componentUuid
     */
    removeComponentByUuid: function(componentUuid) {
        if (this.componentUuidToComponentMap.containsKey(componentUuid)) {
            var component = this.componentUuidToComponentMap.get(componentUuid);
            this.componentNameToComponentMap.removeKeyValuePair(component.getComponentName(), component);
            this.componentUuidToComponentMap.remove(componentUuid);
            this.dispatchEvent(new Event(Application.EventTypes.COMPONENT_REMOVED, {
                component: component
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
Application.EventTypes = {
    COMPONENT_ADDED: "Application:ComponentAdded",
    COMPONENT_REMOVED: "Application:ComponentRemoved"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugmarkup.Application', Application);
