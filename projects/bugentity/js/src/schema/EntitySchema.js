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

//@Export('bugentity.EntitySchema')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var List        = bugpack.require('List');
    var Map         = bugpack.require('Map');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var EntitySchema = Class.extend(Obj, {

        _name: "bugentity.EntitySchema",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Class} entityClass
         * @param {string} entityName
         * @param {Object} entityOptions
         */
        _constructor: function(entityClass, entityName, entityOptions) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Class}
             */
            this.entityClass                        = entityClass;

            /**
             * @private
             * @type {boolean}
             */
            this.entityEmbedded                     = false;

            /**
             * @private
             * @type {string}
             */
            this.entityName                         = entityName;

            /**
             * @private
             * @type {boolean}
             */
            this.entityStored                       = true;

            /**
             * @private
             * @type {SchemaProperty}
             */
            this.idProperty                         = null;

            /**
             * @private
             * @type {List.<SchemaIndex>}
             */
            this.indexList                          = new List();

            /**
             * @private
             * @type {List.<SchemaProperty>}
             */
            this.propertyList                       = new List();

            /**
             * @private
             * @type {Map.<string, SchemaProperty>}
             */
            this.propertyNameToSchemaPropertyMap    = new Map();

            if (TypeUtil.isObject(entityOptions)) {
                if (TypeUtil.isBoolean(entityOptions.embedded)) {
                    this.entityEmbedded = entityOptions.embedded;
                }
                if (TypeUtil.isBoolean(entityOptions.stored)) {
                    this.entityStored = entityOptions.stored;
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Class}
         */
        getEntityClass: function() {
            return this.entityClass;
        },

        /**
         * @return {boolean}
         */
        getEntityEmbedded: function() {
            return this.entityEmbedded;
        },

        /**
         * @return {string}
         */
        getEntityName: function() {
            return this.entityName;
        },

        /**
         * @return {boolean}
         */
        getEntityStored: function() {
            return this.entityStored;
        },

        /**
         * @return {SchemaProperty}
         */
        getIdProperty: function() {
            return this.idProperty;
        },

        /**
         * @return {List.<SchemaIndex>}
         */
        getIndexList: function() {
            return this.indexList;
        },

        /**
         * @return {List.<SchemaProperty>}
         */
        getPropertyList: function() {
            return this.propertyList;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {SchemaIndex} schemaIndex
         */
        addIndex: function(schemaIndex) {
            this.indexList.add(schemaIndex);
        },

        /**
         * @param {SchemaProperty} schemaProperty
         */
        addProperty: function(schemaProperty) {
            if (!this.hasProperty(schemaProperty.getName())) {
                if (schemaProperty.isId() && !this.idProperty) {
                    this.idProperty = schemaProperty;
                }
                this.propertyList.add(schemaProperty);
                this.propertyNameToSchemaPropertyMap.put(schemaProperty.getName(), schemaProperty);
            }
        },

        /**
         * @param {string} name
         * @return {SchemaProperty}
         */
        getPropertyByName: function(name) {
            return this.propertyNameToSchemaPropertyMap.get(name);
        },

        /**
         * @param {string} name
         * @return {boolean}
         */
        hasProperty: function(name) {
            return this.propertyNameToSchemaPropertyMap.containsKey(name);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntitySchema', EntitySchema);
});
