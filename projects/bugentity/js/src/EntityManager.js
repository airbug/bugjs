//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('StringUtil')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaDocumentChange')
//@Require('bugdelta.ObjectChange')
//@Require('bugdelta.SetChange')
//@Require('bugentity.EntityManagerProcessor')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var StringUtil              = bugpack.require('StringUtil');
var TypeUtil                = bugpack.require('TypeUtil');
var DeltaDocumentChange     = bugpack.require('bugdelta.DeltaDocumentChange');
var ObjectChange            = bugpack.require('bugdelta.ObjectChange');
var SetChange               = bugpack.require('bugdelta.SetChange');
var EntityManagerProcessor  = bupgack.require('bugentity.EntityManagerProcessor');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel        = BugFlow.$forEachParallel;
var $iterableParallel       = BugFlow.$iterableParallel;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {EntityManagerStore} entityManagerStore
     * @param {SchemaManager} schemaManager
     * @param {MongoDataStore} mongoDataStore
     */
    _constructor: function(entityManagerStore, schemaManager, mongoDataStore) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MongoManager}
         */
        this.dataStore              = null;

        /**
         * @private
         * @type {EntityManagerStore}
         */
        this.entityManagerStore     = entityManagerStore;

        /**
         * @private
         * @type {string}
         */
        this.entityType             = null;

        /**
         * @private
         * @type {mongo.MongoDataStore}
         */
        this.mongoDataStore         = mongoDataStore;

        /**
         * @private
         * @type {SchemaManager}
         */
        this.schemaManager          = schemaManager;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getEntityType: function() {
        return this.entityType;
    },

    /**
     * @param {string} entityType
     */
    setEntityType: function(entityType) {
        this.entityType = entityType;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Entity} entity
     * @param {function(Throwable, Entity)} callback
     */
    create: function(entity, callback){
        if (!entity.getCreatedAt()) {
            entity.setCreatedAt(new Date());
            entity.setUpdatedAt(new Date());
        }
        this.dataStore.create(entity.toObject(), function(throwable, dbObject) {
            if (!throwable) {
                entity.setId(dbObject.id);
                callback(undefined, entity);
            } else {
                callback(throwable, entity);
            }
        });
    },

    /**
     * @param {Entity} entity
     * @param {function(Throwable)} callback
     */
    delete: function(entity, callback){
        var id = entity.getId();
        this.dataStore.findByIdAndRemove(id, function(error, dbObject) {
            callback(error);
        });
    },

    /**
     * @param {string} id
     * @param {function(error)} callback
     */
    deleteById: function(id, callback){
        this.dataStore.findByIdAndRemove(id, function(error, dbObject) {
            callback(error);
        });
    },

    /**
     * @param {Entity} entity
     * @param {{
     *      propertySchemas: {
     *          *propertyName*: {
     *              idGetter:   function(),
     *              idSetter:   function(),
     *              getter:     function(),
     *              setter:     function()
     *          }
     *      }
     * }} options
     * @param {Array.<string>} properties
     * @param {function(Throwable)} callback
     */
    populate: function(entity, options, properties, callback) {
        var _this               = this;
        var schema              = this.schemaManager.getSchemaByClass(entity.getClass());
        $forEachParallel(properties, function(flow, property) {
            if (schema.hasProperty(property)) {
                /** @type {SchemaProperty} */
                var schemaProperty      = schema.getPropertyByName(property);
                var propertyOptions     = options[property];
                if (propertyOptions) {
                    if (schemaProperty.getPopulates()) {
                        var returnedProperty    = propertyOptions.getter.call(entity);
                        var manager             = undefined;
                        var retriever           = undefined;
                        switch (schemaProperty.getType()) {
                            case "Set":
                                var idSet               = propertyOptions.idGetter.call(entity);
                                var returnedEntitySet   = returnedProperty;
                                var lookupIdSet         = idSet.clone();
                                retriever               = "retriever" + schemaProperty.getMeta().

                                returnedEntitySet.clone().forEach(function(returnedEntity) {
                                    if (idSet.contains(returnedEntity.getId())) {
                                        lookupIdSet.remove(returnedEntity.getId());
                                    } else {
                                        returnedEntitySet.remove(returnedEntity);
                                    }
                                });

                                $iterableParallel(lookupIdSet, function(flow, entId) {
                                    propertyKeys.retriever.call(propertyKeys.manager, entId, function(throwable, returnEnt) {
                                        if (!throwable) {
                                            entitySet.add(returnEnt);
                                        }
                                        flow.complete(throwable);
                                    });
                                }).execute(function(throwable) {
                                    flow.complete(throwable);
                                });
                                break;
                            default:
                                manager = _this.schemaManager.getSchemaBy
                                var id  = propertyOptions.idGetter.call(entity);
                                if (id) {
                                    if (!returnedProperty || returnedProperty.getId() !== id) {
                                        propertyKeys.retriever.call(propertyKeys.manager, id, function(throwable, retrievedEntity) {
                                            if (!throwable) {
                                                propertyKeys.setter.call(entity, retrievedEntity);
                                            }
                                            flow.complete(throwable);
                                        })
                                    } else {
                                        flow.complete();
                                    }
                                } else {
                                    flow.complete();
                                }
                                break;
                        }
                    } else {
                        flow.error(new Error("Property '" + property + "' is not marked with 'populates'"));
                    }
                } else {
                    flow.error(new Error("Cannot find options for property '" + property + "'"));
                }
            } else {
                flow.error(new Error("Unknown property '" + property + "'"));
            }
        }).execute(callback);
    },

    /**
     * @param {Entity} entity
     * @param {{
     *      unsetters: {*}
     * }=} options
     * @param {function(Throwable, Entity)} callback
     */
    update: function(entity, options, callback){
        var dataStore   = this.dataStore;
        var delta       = entity.generateDelta();
        var id          = entity.getId();
        var updates     = {
            $set: {},
            $unset: {},
            $addToSet: {},
            $pull: {}
        };

        if (TypeUtil.isFunction(options)) {
            callback = options;
            options  = {
                unsetters: entity.toObject()
            };
            delete options.unsetters.id;
            delete options.unsetters._id;
            delete options.unsetters.createdAt;
            delete options.unsetters.updatedAt;
        }

        delta.getDeltaChangeList().forEach(function(deltaChange){
            switch (deltaChange.getType()) {
                case DeltaDocumentChange.ChangeTypes.DATA_SET:
                    var setters            = deltaChange.getData();
                    for(var opt in options.unsetters){
                        updates.$unset[opt] = "";
                    }
                    for(var opt in setters){
                        updates.$set[opt] = setters[opt];
                    }
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_REMOVED:
                    var propertyName    = deltaChange.getPropertyName();
                    updates.$unset[propertyName] = "";
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_SET:
                    var propertyName    = deltaChange.getPropertyName();
                    var propertyValue   = deltaChange.getPropertyValue();
                    updates.$set[propertyName] = propertyValue;
                    break;
                case SetChange.ChangeTypes.ADDED_TO_SET:
                    var path            = deltaChange.getPath(); //TODO Parse Path
                    var setValue        = deltaChange.getSetValue();
                    if(updates.$addToSet[path]){
                        updates.$addToSet[path].$each.push(setValue);
                    } else {
                        updates.$addToSet[path] = {$each: [setValue]};
                    }
                    break;
                case SetChange.ChangeTypes.REMOVED_FROM_SET:
                    var path            = deltaChange.getPath(); //TODO Parse Path
                    var setValue        = deltaChange.getSetValue();
                    if(updates.$pull[path]){
                        updates.$pull[path].$each.push(setValue);
                    } else {
                        updates.$pull[path] = {$each: [setValue]};
                    }
                    break;
            }
        });

        dataStore.findByIdAndUpdate(id, updates, function(error, dbObject) {
            if (!error) {
                callback(null, entity);
            } else {
                callback(error, entity);
            }
        });
    },

    /**
     * @param {string} id
     * @param {function(Throwable, Entity)} callback
     */
    retrieve: function(id, callback){
        var _this = this;
        this.dataStore.findById(id).lean(true).exec(function(throwable, dbJson) {
            if (!throwable) {
                var entityObject = null;
                if (dbJson) {
                    entityObject = _this["generate" + _this.entityType](dbJson);
                    entityObject.commitDelta();
                }
                callback(undefined, entityObject);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} ids
     * @param {function(Throwable, Map.<string, Entity>)} callback
     */
    retrieveEach: function(ids, callback) {
        var _this = this;
        this.dataStore.where("_id").in(ids).lean(true).exec(function(throwable, results) {
            if(!throwable){
                var newMap = new Map();
                results.forEach(function(result) {
                    var entityObject = _this["generate" + _this.entityType](result);
                    entityObject.commitDelta();
                    newMap.put(entityObject.getId(), entityObject);
                });
                ids.forEach(function(id) {
                    if (!newMap.containsKey(id)) {
                        newMap.put(id, null);
                    }
                });
                callback(undefined, newMap);
            } else {
                callback(throwable, null);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {

        // TODO BRN: We shouldn't process the annotations here. Instead we should have an outside scanner that looks
        // for EntityManager annotations and automatically instantiates those managers. Have to figure out how to
        // get ahold of those managers again though so that we can inject them in to the service classes.

        this.processAnnotations();
        this.dataStore = this.mongoDataStore.generateManager(this.entityType);
        this.entityManagerStore.registerEntityManager(this);
    },

    /**
     * @private
     */
    processAnnotations: function() {
        var entityManagerProcessor = new EntityManagerProcessor(this);
        entityManagerProcessor.scanClass(EntityManager);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManager', EntityManager);
