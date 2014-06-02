/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugmarkup.Application')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('MultiSetMap')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var Application = Class.extend(EventDispatcher, {

        _name: "bugmarkup.Application",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
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
        // Public Methods
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
     * @static
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
});
