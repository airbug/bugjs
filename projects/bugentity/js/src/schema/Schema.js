//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('Schema')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var List        = bugpack.require('List');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Schema = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(entityClass, entityName) {

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
         * @type {string}
         */
        this.entityName                         = entityName;

        /**
         * @private
         * @type {SchemaProperty}
         */
        this.idProperty                         = null;

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
     * @return {string}
     */
    getEntityName: function() {
        return this.entityName;
    },

    /**
     * @return {SchemaProperty}
     */
    getIdProperty: function() {
        return this.idProperty;
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

bugpack.export('bugentity.Schema', Schema);
