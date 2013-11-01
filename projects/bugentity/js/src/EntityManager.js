//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityManager')

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
        this.dataStore              = undefined;

        /**
         * @private
         * @type {EntityManagerStore}
         */
        this.entityManagerStore     = entityManagerStore;

        /**
         * @private
         * @type {string}
         */
        this.entityType             = undefined;

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
     *              getter:     function(),
     *              setter:     function()
     *          }
     *      }
     * }} options
     * @param {Array.<string>} properties
     * @param {function(Throwable)} callback
     */
    populate: function(entity, options, properties, callback) {
        console.log("Inside EntityManager#populate");
        var _this               = this;
        var schema              = this.schemaManager.getSchemaByClass(entity.getClass());
        $forEachParallel(properties, function(flow, property) {
            console.log("Inside EntityManager#populate forEachParallel");
            if (schema.hasProperty(property)) {
                /** @type {SchemaProperty} */
                var schemaProperty      = schema.getPropertyByName(property);
                var schemaPropertyType  = schemaProperty.getType();
                var propertyOptions     = options[property];
                if (propertyOptions) {
                    console.log("Inside propertyOptions if");
                    // SUNG @BRN What getPopulates for? Is there a new method for this?
                    // console.log("schemaProperty.getPopulates():", schemaProperty.getPopulates());
                    // if (schemaProperty.getPopulates()) {
                        console.log("Inside schemaProperty.getPopulates() if");
                        var manager             = undefined;
                        var retriever           = undefined;
                        console.log("right before switch statement");
                        switch (schemaProperty.getType()) {
                            case "Set":
                                console.log("Inside Set case switch");
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
                                            if(throwable) console.log("Set retriever throwable:", throwable);
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
                                manager             = _this.entityManagerStore.getEntityManagerByEntityType(schemaProperty.getType());
                                if (propertyOptions.retriever) {
                                    retriever = manager[propertyOptions.retriever];
                                } else {
                                    retriever = manager["retrieve" + schemaProperty.getType()];
                                }
                                if (getterId) {
                                    if (!getterProperty || getterProperty.getId() !== getterId) {
                                        retriever.call(manager, getterId, function(throwable, retrievedEntity) {
                                            if(throwable) console.log("default retriever throwable:", throwable);
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
                    // } else {
                    //     // SUNG @BRN Same question as above. What is this? How do you mark with populates?
                    //     flow.error(new Error("Property '" + property + "' is not marked with 'populates'"));
                    // }
                } else {
                    flow.error(new Error("Cannot find options for property '" + property + "'"));
                }
            } else {
                flow.error(new Error("Unknown property '" + property + "'"));
            }
        }).execute(function(throwable){
            if(throwable) console.log(throwable.toString());
            callback(throwable);
        });
    },

    /**
     * @param {Entity} entity
     * @param {{
     *      unsetters: {*}
     * }=} options
     * @param {function(Throwable, Entity)} callback
     */
    update: function(entity, options, callback){
        var dataStore       = this.dataStore;
        var id              = entity.getId();

        if (TypeUtil.isFunction(options)) {
            //TEST
            console.log("options is a function!");

            callback = options;
            options  = {
                unsetters: entity.toObject()
            };
            delete options.unsetters.id;
            delete options.unsetters._id;
            delete options.unsetters.createdAt;
            delete options.unsetters.updatedAt;
        }

        var updateObject = this.buildUpdateObject(entity, options);
        //TEST
        console.log("EntityManager update - id:", id, " updateObject:", updateObject);

        dataStore.findByIdAndUpdate(id, updateObject, function(throwable, dbObject) {
            //TEST
            console.log("findByIdAndUpdate COMPLETE - throwable:", throwable, " dbObject:", dbObject);

            if (!throwable) {
                callback(undefined, entity);
            } else {
                callback(throwable, entity);
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
            if (!throwable) {
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
                callback(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable)}
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
     * @param {} options
     */
    buildUpdateObject: function(entity, options) {
        var delta           = entity.generateDelta();
        var updateChanges   = new MongoUpdateChanges();
        delta.getDeltaChangeList().forEach(function(deltaChange) {
            switch (deltaChange.getChangeType()) {
                case DeltaDocumentChange.ChangeTypes.DATA_SET:
                    var setters            = deltaChange.getData();
                    for(var opt in setters) {
                        updateChanges.putSetChange(opt, setters[opt]);
                    }
                    for(var opt in options.unsetters) {
                        if (!updateChanges.containsSetChange(opt)) {
                            updateChanges.addUnsetChange(opt);
                        }
                    }
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
