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

//@Export('mongo.MongoDataStore')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugentity.EntityDataStore')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IProcessModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('mongo.MongoManager')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
    var Class                   = bugpack.require('Class');
    var Map                     = bugpack.require('Map');
    var Obj                     = bugpack.require('Obj');
    var TypeUtil                = bugpack.require('TypeUtil');
    var EntityDataStore         = bugpack.require('bugentity.EntityDataStore');
    var ArgTag           = bugpack.require('bugioc.ArgTag');
    var IProcessModule          = bugpack.require('bugioc.IProcessModule');
    var ModuleTag        = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var MongoManager            = bugpack.require('mongo.MongoManager');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityDataStore}
     * @implements {IProcessModule}
     */
    var MongoDataStore = Class.extend(EntityDataStore, {

        _name: "mongo.MongoDataStore",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {SchemaManager} schemaManager
         * @param {*} mongoose
         */
        _constructor: function(logger, schemaManager, mongoose) {

            this._super(logger, schemaManager);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<Class, MongoManager>}
             */
            this.managerMap             = new Map();

            /**
             * @private
             * @type {*}
             */
            this.mongoose               = mongoose;

            /**
             * @private
             * @type {Map.<string, Object>}
             */
            this.mongooseSchemaDataMap  = new Map();

            /**
             * @private
             * @type {boolean}
             */
            this.processed              = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Map.<Class, MongoManager>}
         */
        getManagerMap: function() {
            return this.managerMap;
        },

        /**
         * @return {*}
         */
        getMongoose: function() {
            return this.mongoose;
        },


        //-------------------------------------------------------------------------------
        // IProcessModule Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        processModule: function() {
            if (!this.processed) {
                this.processed = true;
                this.processSchemas();
            } else {
                throw new Bug("IllegalState", {}, "Already processed module SchemaManager");
            }
        },


        //-------------------------------------------------------------------------------
        // EntityDataStore Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {EntitySchema} entitySchema
         */
        processSchema: function(entitySchema) {
            if (entitySchema.getEntityStored()) {
                var mongooseSchema = this.buildMongooseSchemaFromEntitySchema(entitySchema);
                this.buildMongooseModel(entitySchema, mongooseSchema);
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} url
         */
        connect: function(url) {
            this.mongoose.connect(url);
        },

        /**
         * @param {string} modelName
         * @return {MongoManager}
         */
        generateManager: function(modelName) {
            this.assertProcessed();
            var manager = this.managerMap.get(modelName);
            if (!manager) {
                var model   = this.mongoose.model(modelName);
                var schema  = model.schema;
                manager     = new MongoManager(model, schema);
            }
            return manager;
        },

        /**
         * @param {string} name
         * @return {*}
         */
        getMongooseModelForName: function(name) {
            this.assertProcessed();
            return this.mongoose.model(name);
        },

        /**
         * @param {string} name
         * @return {*}
         */
        getMongooseSchemaForName: function(name) {
            this.assertProcessed();
            var model = this.getMongooseModelForName(name);
            if (model) {
                return model.schema;
            } else {
                return null;
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        assertProcessed: function() {
            if (!this.processed) {
                throw new Bug("AssertFailed", {}, "Module 'MongoDataStore' has not been processed");
            }
        },

        /**
         * @private
         * @param {EntitySchema} entitySchema
         * @param {*} mongooseSchema
         * @return {*}
         */
        buildMongooseModel: function(entitySchema, mongooseSchema) {
            return this.mongoose.model(entitySchema.getEntityName(), mongooseSchema);
        },

        /**
         * @private
         * @param {EntitySchema} entitySchema
         */
        buildMongooseSchemaFromEntitySchema: function(entitySchema) {
            var _this               = this;
            var mongooseSchemaData  = {};
            entitySchema.getPropertyList().forEach(function(schemaProperty) {
                if (schemaProperty.isStored() && !schemaProperty.isPrimaryId()) {
                    mongooseSchemaData[schemaProperty.getName()] = _this.buildMongooseSchemaProperty(schemaProperty);
                }
            });
            var mongooseSchema = new _this.mongoose.Schema(mongooseSchemaData);
            entitySchema.getIndexList().forEach(function(schemaIndex) {
                var mongooseIndexData = _this.buildMongooseSchemaIndex(schemaIndex);
                mongooseSchema.index(mongooseIndexData.data, mongooseIndexData.options);
            });
            this.mongooseSchemaDataMap.put(mongooseSchema, mongooseSchemaData);
            return mongooseSchema;
        },

        /**
         * @private
         * @param {SchemaIndex} schemaIndex
         * @returns {{data: Object, options: {unique: boolean}}}
         */
        buildMongooseSchemaIndex: function(schemaIndex) {
            return {
                data: schemaIndex.getPropertyObject(),
                options: {
                    unique: schemaIndex.isUnique()
                }
            };
        },

        /**
         * @private
         * @param {SchemaProperty} schemaProperty
         */
        buildMongooseSchemaProperty: function(schemaProperty) {
            switch(schemaProperty.getType()) {
                case "boolean":
                case "date":
                case "mixed":
                case "number":
                case "string":
                    return this.generateMongooseBasicSchemaProperty(schemaProperty);
                case "array":
                    return this.generateMongooseArraySchemaProperty(schemaProperty);
                case "Pair":
                    return this.generateMongoosePairSchemaProperty(schemaProperty);
                case "Set":
                    return this.generateMongooseSetSchemaProperty(schemaProperty);
                default:
                    return this.generateMongooseSubDocSchemaProperty(schemaProperty);
            }
        },

        /**
         * @private
         * @param {SchemaProperty} schemaProperty
         */
        determineMongooseSchemaPropertyType: function(schemaProperty) {
            if (schemaProperty.isId()) {
                return this.mongoose.Schema.Types.ObjectId;
            } else {
                var type = schemaProperty.getType();
                if (schemaProperty.getCollectionOf()) {
                    type = schemaProperty.getCollectionOf();
                }
                switch(type) {
                    case "boolean":
                        return Boolean;
                    case "date":
                        return Date;
                    case "mixed":
                        return this.mongoose.Schema.Types.Mixed;
                    case "number":
                        return Number;
                    case "string":
                        return String;
                }
            }
        },

        /**
         * @private
         * @param {SchemaProperty} schemaProperty
         * @returns {{type: *[], index: boolean}}
         */
        generateMongooseArraySchemaProperty: function(schemaProperty) {
            if (schemaProperty.getType() === "array") {
                var mongoosePropertyType = this.determineMongooseSchemaPropertyType(schemaProperty);
                return {
                    index: schemaProperty.isIndexed(),
                    type: [mongoosePropertyType]
                };
            } else {
                throw new Bug("IllegalArgument", {}, "schemaProperty must be of the type array");
            }
        },

        /**
         * @private
         * @param {SchemaProperty} schemaProperty
         * @returns {{index: boolean, required: boolean, type: *, unique: boolean, default: *}}
         */
        generateMongooseBasicSchemaProperty: function(schemaProperty) {
            var mongooseSchemaProperty = {
                index: schemaProperty.isIndexed(),
                required: schemaProperty.isRequired(),
                type: this.determineMongooseSchemaPropertyType(schemaProperty),
                unique: schemaProperty.isUnique()
            };
            if (!TypeUtil.isNull(schemaProperty.getDefault())) {
                mongooseSchemaProperty.default = schemaProperty.getDefault();
            }
            return mongooseSchemaProperty;
        },

        /**
         * @private
         * @param {SchemaProperty} schemaProperty
         * @returns {{a: {type: *, required: boolean, index: boolean}, b: {type: *, required: boolean, index: boolean}}}
         */
        generateMongoosePairSchemaProperty: function(schemaProperty) {
            if (schemaProperty.getType() === "Pair") {
                var mongoosePropertyType = this.determineMongooseSchemaPropertyType(schemaProperty);
                return {
                    a: {
                        index: schemaProperty.isIndexed(),
                        required: schemaProperty.isRequired(),
                        type: mongoosePropertyType
                    },
                    b: {
                        index: schemaProperty.isIndexed(),
                        required: schemaProperty.isRequired(),
                        type: mongoosePropertyType
                    }
                };
            } else {
                throw new Bug("IllegalArgument", {}, "schemaProperty must be of the type Pair");
            }
        },

        /**
         * @private
         * @param {SchemaProperty} schemaProperty
         * @returns {{type: *[], index: boolean}}
         */
        generateMongooseSetSchemaProperty: function(schemaProperty) {
            if (schemaProperty.getType() === "Set") {
                var mongoosePropertyType = this.determineMongooseSchemaPropertyType(schemaProperty);
                return {
                    index: schemaProperty.isIndexed(),
                    type: [mongoosePropertyType]
                };
            } else {
                throw new Bug("IllegalArgument", {}, "schemaProperty must be of the type Set");
            }
        },

        /**
         * @private
         * @param {SchemaProperty} schemaProperty
         * @returns {{type: *}}
         */
        generateMongooseSubDocSchemaProperty: function(schemaProperty) {
            var mongooseSchema      = this.getMongooseSchemaForName(schemaProperty.getType());
            if (mongooseSchema) {
                var mongooseSchemaData  = this.mongooseSchemaDataMap.get(mongooseSchema);
                if (mongooseSchemaData) {
                    return mongooseSchemaData;
                } else {
                    throw new Bug("IllegalState", {}, "Cannot find mongooseSchemaData for MongooseSchema '" + schemaProperty.getType() + "'");
                }
            } else {
                throw new Bug("IllegalState", {}, "Cannot find MongooseSchemaD for property type '" + schemaProperty.getType() + "'");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MongoDataStore, IProcessModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MongoDataStore).with(
        module("mongoDataStore")
            .args([
                arg().ref("logger"),
                arg().ref("schemaManager"),
                arg().ref("mongoose")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.MongoDataStore', MongoDataStore);
});
