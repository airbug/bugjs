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

//@Export('bugmarkup.Component')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugmarkup.PropertyChange')


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
    var Obj                 = bugpack.require('Obj');
    var UuidGenerator       = bugpack.require('UuidGenerator');
    var PropertyChange      = bugpack.require('bugmarkup.PropertyChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var Component = Class.extend(EventDispatcher, {

        _name: "bugmarkup.Component",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} componentUuid
         * @param {string} componentName
         */
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
     * @static
     * @enum {string}
     */
    Component.EventTypes = {
        PROPERTY_CHANGED: "Component:PropertyChange"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarkup.Component', Component);
});
