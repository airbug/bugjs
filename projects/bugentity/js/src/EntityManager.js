//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManager')

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('StringUtil')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaDocumentChange')
//@Require('bugdelta.ObjectChange')
//@Require('bugdelta.SetChange')
//@Require('bugflow.BugFlow')
//@Require('bugioc.IInitializeModule')
//@Require('mongo.MongoUpdateChanges')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var StringUtil              = bugpack.require('StringUtil');
var TypeUtil                = bugpack.require('TypeUtil');
var DeltaDocumentChange     = bugpack.require('bugdelta.DeltaDocumentChange');
var ObjectChange            = bugpack.require('bugdelta.ObjectChange');
var SetChange               = bugpack.require('bugdelta.SetChange');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var IInitializeModule       = bugpack.require('bugioc.IInitializeModule');
var MongoUpdateChanges      = bugpack.require('mongo.MongoUpdateChanges');


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
         * @type {MongoDataStore}
         */
        this.mongoDataStore         = mongoDataStore;

        /**
         * @private
         * @type {SchemaManager}
         */
        this.schemaManager          = schemaManager;
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
     * @param {{*}} options
     * @param {Array.<string>} dependencies
     * @param {function(Throwable, Entity=)} callback
     */
    create: function(entity, options, dependencies, callback) {
        var _this = this;
        if (!entity.getCreatedAt()) {
            entity.setCreatedAt(new Date());
            entity.setUpdatedAt(new Date());
        }
        var dbObject = this.convertEntityToDbObject(entity);

        $series([
            $task(function(flow){
                _this.dataStore.create(dbObject, function(throwable, dbObject) {
                    if (!throwable) {
                        entity.setId(dbObject._id.toString());
                    }
                    flow.complete(throwable);
                });
            }),
            $forEachParallel(dependencies, function(flow, dependency) {
                var dependencyOptions = options[dependency];
                if (dependencyOptions) {
                    var schema              = _this.schemaManager.getSchemaByClass(entity.getClass());
                    var schemaProperty      = schema.getPropertyByName(dependency);
                    if (schemaProperty) {
                        var schemaPropertyType  = schemaProperty.getType();
                        var manager             = _this.entityManagerStore.getEntityManagerByEntityType(schemaPropertyType);
                        var data                = {};
                        data[dependencyOptions.ownerIdProperty] = entity.getId();
                        var generatedDependency = manager["generate" + schemaPropertyType](data);
                        manager["create" + schemaPropertyType](generatedDependency, function(throwable, returnedDependency){
                            var idSetter    = dependencyOptions.idSetter;
                            var setter      = dependencyOptions.setter;
                            var ownerProperty = dependencyOptions.ownerProperty;
                            if (idSetter) {
                                idSetter.call(entity, generatedDependency.getId());
                            }
                            if (setter) {
                                setter.call(entity, generatedDependency);
                            }
                            if (ownerProperty) {
                                generatedDependency["set" + StringUtil.capitalize(ownerProperty)](entity);
                            }
                            flow.complete(throwable);
                        });
                    } else {
                        flow.error(new Bug("EntityManager", {}, "Unknown dependency '" + dependency + "'"));
                    }
                } else {
                    flow.error(new Bug("EntityManager", {}, "Cannot find options for dependency '" + dependency + "'"));
                }
            })
        ]).execute(function(throwable){
            if (!throwable) {
                entity.commitDelta();
                callback(null, entity);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Entity} entity
     * @param {function(Throwable=)} callback
     */
    delete: function(entity, callback){
        var _this   = this;
        var id      = entity.getId();
        this.dataStore.findByIdAndRemove(id, function(dbError, dbObject) {
            if (!dbError) {
                entity.commitDelta();
                callback();
            } else {
                callback(_this.factoryBugFromDbError(dbError));
            }
        });
    },

    /**
     * @param {string} id
     * @param {function(Throwable=)} callback
     */
    deleteById: function(id, callback){
        var _this   = this;
        this.dataStore.findByIdAndRemove(id, function(dbError, dbObject) {
            if (!dbError) {
                callback();
            } else {
                callback(_this.factoryBugFromDbError(dbError));
            }
        });
    },

    /**
     * @param {Entity} entity
     * @param {{
     *      propertySchemas: {
     *          *propertyName*: {
     *              idGetter:   function(),
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
                var schemaPropertyType  = schemaProperty.getType();
                var propertyOptions     = options[property];
                if (propertyOptions) {
                    if (schemaProperty.isPopulates()) {
                        var manager             = undefined;
                        var retriever           = undefined;
                        switch (schemaPropertyType) {
                            case "Set":
                                var idData              = propertyOptions.idGetter.call(entity);
                                manager                 = _this.entityManagerStore.getEntityManagerByEntityType(schemaProperty.getCollectionOf());
                                if (propertyOptions.retriever) {
                                    retriever = manager[propertyOptions.retriever];
                                } else {
                                    retriever = manager["retrieve" + schemaProperty.getCollectionOf()];
                                }
                                if (Class.doesExtend(idData, Set)) {
                                    var getterEntitySet     = propertyOptions.getter.call(entity);
                                    var lookupIdSet         = Obj.clone(idData);
                                    var getterEntitySetClone = getterEntitySet.clone();

                                    getterEntitySetClone.forEach(function(getterEntity) {
                                        if (idData.contains(getterEntity.getId())) {
                                            lookupIdSet.remove(getterEntity.getId());
                                        } else {
                                            getterEntitySet.remove(getterEntity);
                                        }
                                    });

                                    $iterableParallel(lookupIdSet, function(flow, entityId) {
                                        retriever.call(manager, entityId, function(throwable, retrievedEntity) {
                                            if (!throwable) {
                                                getterEntitySet.add(retrievedEntity);
                                            }
                                            flow.complete(throwable);
                                        });
                                    }).execute(function(throwable) {
                                        flow.complete(throwable);
                                    });
                                } else {
                                    var setter = propertyOptions.setter;
                                    retriever.call(manager, idData, function(throwable, retrievedData) {
                                        if (!throwable) {
                                            setter.call(entity, retrievedData);
                                        }
                                        flow.complete(throwable)
                                    });
                                }
                                break;
                            default:
                                var getterProperty  = propertyOptions.getter.call(entity);
                                var getterId        = propertyOptions.idGetter.call(entity);
                                manager             = _this.entityManagerStore.getEntityManagerByEntityType(schemaPropertyType);
                                if (propertyOptions.retriever) {
                                    retriever = manager[propertyOptions.retriever];
                                } else {
                                    retriever = manager["retrieve" + schemaPropertyType];
                                }
                                if (getterId) {
                                    if (!getterProperty || getterProperty.getId() !== getterId) {
                                        retriever.call(manager, getterId, function(throwable, retrievedEntity) {
                                            if (!throwable) {
                                                propertyOptions.setter.call(entity, retrievedEntity);
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
        }).execute(function(throwable){
            callback(throwable);
        });
    },

    /**
     * @param {Entity} entity
     * @param {function(Throwable, Entity=)} callback
     */
    update: function(entity, callback){
        entity.setUpdatedAt(new Date());

        var _this           = this;
        var dataStore       = this.dataStore;
        var id              = entity.getId();
        var updateObject    = this.buildUpdateObject(entity);
        dataStore.findByIdAndUpdate(id, updateObject, function(dbError, dbObject) {
            if (!dbError) {
                entity.commitDelta();
                callback(null, entity);
            } else {
                callback(_this.factoryBugFromDbError(dbError));
            }
        });
    },

    /**
     * @param {string} id
     * @param {function(Throwable, Entity=)} callback
     */
    retrieve: function(id, callback) {
        var _this = this;
        this.dataStore.findById(id).lean(true).exec(function(throwable, dbObject) {
            if (!throwable) {
                var entity = null;
                if (dbObject) {
                    entity = _this.convertDbObjectToEntity(dbObject);
                    entity.commitDelta();
                }
                callback(null, entity);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} ids
     * @param {function(Throwable, Map.<string, Entity>=)} callback
     */
    retrieveEach: function(ids, callback) {
        var _this = this;
        this.dataStore.where("_id").in(ids).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newMap = new Map();
                dbObjects.forEach(function(dbObject) {
                    var entity = _this.convertDbObjectToEntity(dbObject);
                    entity.commitDelta();
                    newMap.put(entity.getId(), entity);
                });
                ids.forEach(function(id) {
                    if (!newMap.containsKey(id)) {
                        newMap.put(id, null);
                    }
                });
                callback(null, newMap);
            } else {
                callback(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        this.dataStore = this.mongoDataStore.generateManager(this.entityType);
        this.entityManagerStore.registerEntityManager(this);
        callback();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Entity} entity
     */
    buildUpdateObject: function(entity) {
        var _this           = this;
        var delta           = entity.generateDelta();
        var updateChanges   = new MongoUpdateChanges();
        var entitySchema    = this.schemaManager.getSchemaByClass(entity.getClass());
        delta.getDeltaChangeList().forEach(function(deltaChange) {
            switch (deltaChange.getChangeType()) {
                case DeltaDocumentChange.ChangeTypes.DATA_SET:
                    var dbObject = _this.convertDataObjectToDbObject(deltaChange.getData(), entitySchema);
                    Obj.forIn(dbObject, function(name, value) {
                        updateChanges.putSetChange(name, value);
                    });
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_REMOVED:
                    var key = "";
                    if (deltaChange.getPath()) {
                        key += deltaChange.getPath() + ".";
                    }
                    key += deltaChange.getPropertyName();
                    updateChanges.addUnsetChange(key);
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_SET:
                    var key = "";
                    if (deltaChange.getPath()) {
                        key += deltaChange.getPath() + ".";
                    }
                    key += deltaChange.getPropertyName();
                    var propertyValue   = deltaChange.getPropertyValue();
                    var schemaProperty  = entitySchema.getPropertyByName(key);
                    if (schemaProperty) {
                        propertyValue = _this.convertDataProperty(propertyValue, schemaProperty);
                    }
                    updateChanges.putSetChange(key, propertyValue);
                    break;
                case SetChange.ChangeTypes.ADDED_TO_SET:
                    var path            = deltaChange.getPath(); //TODO Parse Path
                    var setValue        = deltaChange.getSetValue();
                    updateChanges.putAddToSetChange(path, setValue);
                    break;
                case SetChange.ChangeTypes.REMOVED_FROM_SET:
                    var path            = deltaChange.getPath(); //TODO Parse Path
                    var setValue        = deltaChange.getSetValue();
                    updateChanges.putPullChange(path, setValue);
                    break;
            }
        });

        return updateChanges.buildUpdateObject();
    },

    /**
     * @private
     * @param {Object} dbObject
     * @return {Entity}
     */
    convertDbObjectToEntity: function(dbObject) {
        var entityType      = this.entityType;
        var entitySchema    = this.schemaManager.getSchemaByName(entityType);
        var dataObject = this.convertDbObjectToDataObject(dbObject, entitySchema);
        return this["generate" + this.entityType](dataObject);
    },

    /**
     * @private
     * @param {Object} dbObject
     * @param {Schema} entitySchema
     * @return {Object}
     */
    convertDbObjectToDataObject: function(dbObject, entitySchema) {
        var _this           = this;
        var dataObject      = {};
        entitySchema.getPropertyList().forEach(function(schemaProperty) {
            if (schemaProperty.isStored()) {
                var propertyName    = schemaProperty.getName();
                var propertyValue   = dbObject[propertyName];

                //TODO BRN: need some sort of mapping to do this in a non hacky way

                if (schemaProperty.isPrimaryId() && propertyName === "id") {
                    propertyValue = dbObject._id;
                }
                dataObject[propertyName] = _this.convertDbProperty(propertyValue, schemaProperty);
            }
        });
        return dataObject;
    },

    /**
     * @private
     * @param {*} propertyValue
     * @param {SchemaProperty} schemaProperty
     */
    convertDbProperty: function(propertyValue, schemaProperty) {
        var propertyType    = schemaProperty.getType();
        if (schemaProperty.isPrimaryId()) {
            return propertyValue.toString();
        } else {
            switch (propertyType) {
                case "Set":
                    var valuesSet = new Set();
                    if (propertyValue) {
                        if (schemaProperty.isId()) {
                            propertyValue.forEach(function(value) {
                                if (value) {
                                    valuesSet.add(value.toString());
                                } else {
                                    valuesSet.add(value);
                                }
                            });
                        } else {
                            valuesSet.addAll(propertyValue);
                        }
                    }
                    return valuesSet;
                    break;
                default:
                    if (schemaProperty.isId()) {
                        if (propertyValue) {
                            return propertyValue.toString();
                        } else {
                            return propertyValue
                        }
                    } else {
                        return propertyValue;
                    }
            }
        }
    },

    /**
     * @private
     * @param {Entity} entity
     * @return {Object}
     */
    convertEntityToDbObject: function(entity) {
        var data        = entity.getDeltaDocument().getData();
        var schema      = this.schemaManager.getSchemaByClass(entity.getClass());
        return this.convertDataObjectToDbObject(data, schema);
    },

    /**
     * @private
     * @param {Object} dataObject
     * @param {Schema} schema
     * @return {Object}
     */
    convertDataObjectToDbObject: function(dataObject, schema) {
        var _this       = this;
        var dbObject    = {};
        schema.getPropertyList().forEach(function(schemaProperty) {
            if (schemaProperty.isStored() && !schemaProperty.isPrimaryId()) {
                var propertyName        = schemaProperty.getName();
                var propertyValue       = dataObject[propertyName];
                if (!TypeUtil.isUndefined(propertyValue)) {
                    dbObject[propertyName]  = _this.convertDataProperty(propertyValue, schemaProperty);
                }
            }
        });
        return dbObject
    },

    /**
     * @private
     * @param {*} propertyValue
     * @param {SchemaProperty} schemaProperty
     * @return {*}
     */
    convertDataProperty: function(propertyValue, schemaProperty) {
        var propertyType    = schemaProperty.getType();
        switch (propertyType) {
            case "Set":
                if (propertyValue) {
                    return propertyValue.toArray();
                } else {
                    return [];
                }
                break;
            default:
                if (this.schemaManager.hasSchemaForName(propertyType)) {
                    var entitySchema = this.schemaManager.getSchemaByName(propertyType);
                    return this.convertDataObjectToDbObject(propertyValue, entitySchema);
                } else {
                    return propertyValue;
                }
        }
    },

    /**
     * @private
     * @param {Error} dbError
     */
    factoryBugFromDbError: function(dbError) {
        return new Bug("DbError", {error: dbError}, "An error occurred in the DB", [dbError]);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(EntityManager, IInitializeModule);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityManager', EntityManager);
