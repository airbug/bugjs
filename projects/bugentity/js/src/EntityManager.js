//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManager')

//@Require('ArgumentException')
//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('Obj')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ArgumentException   = bugpack.require('ArgumentException');
var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var Entity              = bugpack.require('bugentity.Entity');
var EntityProcessor     = bugpack.require('bugentity.EntityProcessor');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManager = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(dataEngine, lockEngine, schemaManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IDataEngine}
         */
        this.dataEngine             = dataEngine;

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.keyToEntityMap              = new Map();

        /**
         * @private
         * @type {Map.<*, Entity>}
         */
        this.instanceToEntityMap    = new Map();

        /**
         * @private
         * @type {ILockEngine}
         */
        this.lockEngine             = lockEngine;

        /**
         * @private
         * @type {SchemaManager}
         */
        this.schemaManager          = schemaManager;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} instance
     * @param {function((Exception | Error))} callback
     */
    create: function(instance, callback) {
        var entity = this.getEntityByInstance(instance);
        if (entity) {
            var _this = this;
            this.lockEngine.lock(entity.getInstanceId(), function(error) {
                if (!error) {
                    _this.
                }
            });
        } else {
            callback(new ArgumentException(ArgumentException.ILLEGAL, "instance", instance));
        }
    },

    /**
     * @param {*} key
     * @param {function((Exception | Error))} callback
     */
    findByKey: function(key, callback) {

    },

    /**
     * @param {Class} entityClass
     * @param {Object} data
     * @return {Object}
     */
    generate: function(entityClass, data) {
        var entity = this.factoryEntity(entityClass);
        this.updateInstanceData(entity, data);
        this.instanceToEntityMap.put(entity.getInstance(), entity);
        return entity.getInstance();
    },

    /**
     * @param {Object} instance
     * @param {function((Exception | Error))} callback
     */
    remove: function(instance, callback) {
        var entity = this.getEntityByInstance(instance);
        if (entity) {

        } else {
            callback(new ArgumentException(ArgumentException.ILLEGAL, "instance", instance));
        }
    },

    /**
     * @param {Object} instance
     * @param {function((Exception | Error))} callback
     */
    update: function(instance, callback) {
        var entity = this.getEntityByInstance(instance);
        if (entity) {

        } else {
            callback(new ArgumentException(ArgumentException.ILLEGAL, "instance", instance));
        }
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Class} entityClass
     * @return {Entity}
     */
    factoryEntity: function(entityClass) {
        if (!this.schemaManager.hasSchemaForClass(entityClass)) {
            this.processEntityClass(entityClass);
        }
        var schema = this.schemaManager.getSchemaByClass(entityClass);
        var instance = new entityClass();
        var entity = new Entity(entityClass, instance, schema);
        return entity;
    },

    /**
     * @private
     * @param {Object} instance
     * @return {Entity}
     */
    getEntityByInstance: function(instance) {
        return this.instanceToEntityMap.get(instance);
    },

    /**
     * @private
     * @param {Class} entityClass
     */
    processEntityClass: function(entityClass) {
        var entityProcessor = new EntityProcessor(this.schemaManager);
        entityProcessor.scanClass(entityClass);
    },

    /**
     * @private
     * @param {Entity} entity
     * @param {Object} data
     */
    updateInstanceData: function(entity, data) {
        var schema = entity.getSchema();
        var instance = entity.getInstance();
        schema.getPropertyList().forEach(function(entityProperty) {

            //TODO BRN: Write a test that validates that defaults of the entityCLass are preserved if not passed in
            // the data object

            if (Obj.hasProperty(data, entityProperty.getName())) {
                instance[entityProperty.getName()] = data[entityProperty.getName()];
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
EntityManager.EventTypes = {
   ENTITY_UPDATED: "EntityManager:EntityUpdated"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManager', EntityManager);
