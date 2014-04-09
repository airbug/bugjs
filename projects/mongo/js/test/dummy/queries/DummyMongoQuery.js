//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('mongo.DummyMongoQuery')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('mongo.DummyMongooseObjectId')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');
var UuidGenerator           = bugpack.require('UuidGenerator');
var DummyMongooseObjectId   = bugpack.require('mongo.DummyMongooseObjectId');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var DummyMongoQuery = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongooseModel} dummyMongooseModel
     */
    _constructor: function(dummyMongooseModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DummyMongooseModel}
         */
        this.dummyMongooseModel = dummyMongooseModel;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    exec: function(callback) {
        var _this = this;
        setTimeout(function() {
            try {
                var result = _this.query();
                callback(undefined, result);
            } catch(error) {
                callback(error);
            }
        }, 0);
    },


    //-------------------------------------------------------------------------------
    // Test Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} createObject
     * @return {Object}
     */
    create: function(createObject) {
        var createObjectClone = Obj.clone(createObject, true);
        createObjectClone._id = this.generateId();
        createObjectClone.__v = 0;
        this.getDummyMongooseModel().getCollection()[createObjectClone._id.toString()] = createObjectClone;
        return createObjectClone;
    },

    /**
     * @param {Object} queryParams
     * @return {Array.<*>}
     */
    find: function(queryParams) {
        queryParams     = Obj.clone(queryParams, true);
        var collection  = this.getDummyMongooseModel().getCollection();
        var dbObjects   = [];
        var whereParam  = null;
        if (queryParams.$where) {
            whereParam = queryParams.$where;
            delete queryParams.$where;
        }
        for (var id in collection) {
            if (collection.hasOwnProperty(id)) {
                var dbObject    = collection[id];
                var matches     = 0;
                var expectedMatches = 0;
                for (var key in queryParams) {
                    if (queryParams.hasOwnProperty(key)) {
                        expectedMatches++;
                        var expectedValue = queryParams[key];
                        if (dbObject[key] === expectedValue) {
                            matches++;
                        }
                    }
                }
                if (matches === expectedMatches) {
                    if (whereParam) {
                        var result = whereParam.call(dbObject);
                        if (result) {
                            dbObjects.push(dbObject);
                        }
                    } else {
                        dbObjects.push(dbObject);
                    }
                }
            }
        }
        return dbObjects
    },

    /**
     * @param {string} id
     * @return {*}
     */
    findById: function(id) {
        var collection  = this.getDummyMongooseModel().getCollection();
        return collection[id];
    },

    /**
     * @param {Object} queryParams
     * @return {}
     */
    findOne: function(queryParams) {
        var dbObjects = this.find(queryParams);
        if (dbObjects.length > 0) {
            return dbObjects[0];
        } else {
            return null;
        }
    },

    /**
     * @return {DummyMongooseModel}
     */
    getDummyMongooseModel: function() {
        return this.dummyMongooseModel;
    },

    /**
     * @param {Object} dbObject
     * @param {Object} updateObject
     */
    updateDbObject: function(dbObject, updateObject) {
        var setObject = updateObject["$set"];
        if (setObject) {
            Obj.forIn(setObject, function(propertyName, propertyValue) {
                Obj.setProperty(dbObject, propertyName, propertyValue);
            });
        }
        var addToSetObject = updateObject["$addToSet"];
        if (addToSetObject) {
            Obj.forIn(addToSetObject, function(propertyName, setUpdateObject) {
                var objectValue = Obj.findProperty(dbObject, propertyName);
                if (TypeUtil.isArray(objectValue)) {
                    if (TypeUtil.isArray(setUpdateObject.$each)) {
                        setUpdateObject.$each.forEach(function(setValue) {

                            //TODO BRN: Cast value
                            if (objectValue.indexOf(setValue) === -1) {
                                objectValue.push(setValue);
                            }
                        });
                    } else {
                        //TODO BRN: Cast value
                        objectValue.push(setUpdateObject.$each);
                    }
                } else {

                    //TODO BRN: Add type checks

                    throw new Error("Can't use $each with... TODO");
                }
            });
        }
        var incObject = updateObject["$inc"];
        if (incObject) {
            Obj.forIn(incObject, function(propertyName, incValue) {
                var objectValue = Obj.findProperty(dbObject, propertyName);
                if (TypeUtil.isNumber(objectValue)) {
                    objectValue += incValue;
                    Obj.setProperty(dbObject, propertyName, objectValue);
                } else {

                    //TODO BRN: Add type checks

                    throw new Error("Cannot apply $inc modifier to non-number");
                }
            });
        }
        return dbObject;
    },

    /**
     * @param {Object} queryParams
     * @param {Object} updateObject
     * @return {Object}
     */
    upsert: function(queryParams, updateObject) {
        queryParams     = Obj.clone(queryParams, true);
        updateObject    = Obj.clone(updateObject, true);
        if (queryParams.$where) {
            delete queryParams.$where;
        }
        updateObject = Obj.merge(queryParams, updateObject);
        return this.create(updateObject);
    },


    //-------------------------------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------------------------------

    /**
     * @returns {Object}
     */
    generateId: function() {
        return new DummyMongooseObjectId(UuidGenerator.generateHexUuid());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyMongoQuery', DummyMongoQuery);
