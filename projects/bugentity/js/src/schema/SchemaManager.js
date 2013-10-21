//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('SchemaManager')
//@Autoload

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('bugentity.EntityProcessor')
//@Require('bugentity.EntityScan')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');
var EntityProcessor     = bugpack.require('bugentity.EntityProcessor');
var EntityScan          = bugpack.require('bugentity.EntityScan');
var IInitializeModule   = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta              = BugMeta.context();
var module               = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SchemaManager = Class.extend(EventDispatcher, {

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
         * @type {Map.<Class, Schema>}
         */
        this.classToSchemaMap   = new Map();

        /**
         * @private
         * @type {Map.<string, Schema>}
         */
        this.nameToSchemaMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable)} callback
     */
    initializeModule: function(callback) {
        var entityScan = new EntityScan(new EntityProcessor(this));
        entityScan.scanAll();
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Class} _class
     * @return {Schema}
     */
    getSchemaByClass: function(_class) {
        return this.classToSchemaMap.get(_class);
    },

    /**
     * @param {string} name
     * @return {Schema}
     */
    getSchemaByName: function(name) {
        return this.nameToSchemaMap.get(name);
    },

    /**
     * @param {Class} _class
     * @return {boolean}
     */
    hasSchemaForClass: function(_class) {
        return this.classToSchemaMap.containsKey(_class);
    },

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasSchemaForName: function(name) {
        return this.nameToSchemaMap.containsKey(name);
    },

    /**
     * @param {Schema} schema
     */
    registerSchema: function(schema) {
        if (this.hasSchemaForClass(schema.getEntityClass())) {
            throw new Error("Schema already registered for class - class:", schema.getEntityClass());
        }
        if (this.hasSchemaForName(schema.getEntityName())) {
            throw new Error("Schema already registered for entity name - name:", schema.getEntityName());
        }
        this.classToSchemaMap.put(schema.getEntityClass(), schema);
        this.nameToSchemaMap.put(schema.getEntityName(), schema);
        this.dispatchEvent(new Event(SchemaManager.EventTypes.SCHEMA_REGISTERED, {schema: schema}));
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(SchemaManager, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SchemaManager).with(
    module("schemaManager")
);


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SchemaManager.EventTypes = {
    SCHEMA_REGISTERED: "SchemaManager:SchemaRegistered"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.SchemaManager', SchemaManager);
