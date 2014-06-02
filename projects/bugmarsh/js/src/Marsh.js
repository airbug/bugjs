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

//@Export('bugmarsh.Marsh')

//@Require('Bug')
//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug     = bugpack.require('Bug');
    var Class   = bugpack.require('Class');
    var List    = bugpack.require('List');
    var Map     = bugpack.require('Map');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Marsh = Class.extend(Obj, {

        _name: "bugmarsh.Marsh",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Class} marshClass
         * @param {string} marshName
         */
        _constructor: function(marshClass, marshName) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Class}
             */
            this.marshClass                        = marshClass;

            /**
             * @private
             * @type {string}
             */
            this.marshName                         = marshName;

            /**
             * @private
             * @type {List.<MarshProperty>}
             */
            this.marshPropertyList                 = new List();

            /**
             * @private
             * @type {Map.<string, MarshProperty>}
             */
            this.propertyNameToMarshPropertyMap    = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Class}
         */
        getMarshClass: function() {
            return this.marshClass;
        },

        /**
         * @return {string}
         */
        getMarshName: function() {
            return this.marshName;
        },

        /**
         * @return {List.<MarshProperty>}
         */
        getMarshPropertyList: function() {
            return this.marshPropertyList;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {MarshProperty} marshProperty
         */
        addProperty: function(marshProperty) {
            if (!this.hasPropertyByName(marshProperty.getPropertyName())) {
                this.marshPropertyList.add(marshProperty);
                this.propertyNameToMarshPropertyMap.put(marshProperty.getPropertyName(), marshProperty);
            } else {
                throw new Bug("IllegalState", {}, "Marsh already has property by the name '" + marshProperty.getPropertyName() + "'");
            }
        },

        /**
         * @param {string} name
         * @return {MarshProperty}
         */
        getPropertyByName: function(name) {
            return this.propertyNameToMarshPropertyMap.get(name);
        },

        /**
         * @param {string} name
         * @return {boolean}
         */
        hasPropertyByName: function(name) {
            return this.propertyNameToMarshPropertyMap.containsKey(name);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugmarsh.Marsh', Marsh);
});
