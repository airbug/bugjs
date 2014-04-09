//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('mongo.DummyMongooseModel')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('mongo.DummyCreateQuery')
//@Require('mongo.DummyFindByIdQuery')
//@Require('mongo.DummyFindByIdAndRemoveQuery')
//@Require('mongo.DummyFindByIdAndUpdateQuery')
//@Require('mongo.DummyFindOneAndUpdateQuery')
//@Require('mongo.DummyFindOneQuery')
//@Require('mongo.DummyFindQuery')
//@Require('mongo.DummyRemoveQuery')
//@Require('mongo.DummyWhereQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var TypeUtil                        = bugpack.require('TypeUtil');
var UuidGenerator                   = bugpack.require('UuidGenerator');
var DummyCreateQuery                = bugpack.require('mongo.DummyCreateQuery');
var DummyFindByIdQuery              = bugpack.require('mongo.DummyFindByIdQuery');
var DummyFindByIdAndRemoveQuery     = bugpack.require('mongo.DummyFindByIdAndRemoveQuery');
var DummyFindByIdAndUpdateQuery     = bugpack.require('mongo.DummyFindByIdAndUpdateQuery');
var DummyFindOneAndUpdateQuery      = bugpack.require('mongo.DummyFindOneAndUpdateQuery');
var DummyFindOneQuery               = bugpack.require('mongo.DummyFindOneQuery');
var DummyFindQuery                  = bugpack.require('mongo.DummyFindQuery');
var DummyRemoveQuery                = bugpack.require('mongo.DummyRemoveQuery');
var DummyWhereQuery                 = bugpack.require('mongo.DummyWhereQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var DummyMongooseModel = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {DummyMongooseSchema} mongooseSchema
     * @param {string} modelName
     */
    _constructor: function(mongooseSchema, modelName) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DummyMongoose}
         */
        this.dummyMongoose  = null;

        /**
         * @private
         * @type {string}
         */
        this.modelName      = modelName;

        /**
         * @type {DummyMongooseSchema}
         */
        this.schema         = mongooseSchema
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getCollection: function() {
        return this.dummyMongoose.getCollection(this.modelName.toLowerCase());
    },


    //-------------------------------------------------------------------------------
    // Mongoose Methods
    //-------------------------------------------------------------------------------

    $where: function() {
        throw new Error("DummyMongoose Not Implemented");
    },
    aggregate: function() {
        throw new Error("DummyMongoose Not Implemented");
    },
    count: function() {
        throw new Error("DummyMongoose Not Implemented");
    },

    /**
     * @param {Object} createObject
     * @param {function(Error, Object)} callback
     */
    create: function(createObject, callback) {
        var query = new DummyCreateQuery(this, createObject);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }
    },

    distinct: function() {
        throw new Error("DummyMongoose Not Implemented");
    },
    ensureIndexes: function(callback) {
        callback();
    },

    /**
     * @param {Object} queryParams
     * @param {function(Error, Object)} callback
     * @returns {DummyFindQuery}
     */
    find: function(queryParams, callback) {
        var query = new DummyFindQuery(this, queryParams);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }
    },

    /**
     * @param {string} id
     * @param {function(Error, Object)} callback
     * @returns {DummyFindByIdQuery}
     */
    findById: function(id, callback) {
        var query = new DummyFindByIdQuery(this, id);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }
    },

    /**
     *
     * @param {string} id
     * @param {function(Error)} callback
     * @returns {DummyFindByIdAndRemoveQuery}
     */
    findByIdAndRemove: function(id, callback) {
        var query = new DummyFindByIdAndRemoveQuery(this, id);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }
    },

    /**
     * @param {string} id
     * @param {Object} updateObject
     * @param {function(Error, Object)} callback
     * @return {DummyFindByIdAndUpdateQuery}
     */
    findByIdAndUpdate: function(id, updateObject, callback) {
        var query = new DummyFindByIdAndUpdateQuery(this, id, updateObject);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }
    },

    /**
     * @param {Object} queryParams
     * @param {function(Error, Object)} callback
     * @returns {DummyFindOneQuery}
     */
    findOne: function(queryParams, callback) {
        var query = new DummyFindOneQuery(this, queryParams);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }

    },

    findOneAndRemove: function() {
        throw new Error("DummyMongoose Not Implemented");
    },

    /**
     * @param {Object} queryParams
     * @param {Object} updateObject
     * @param {(Object | function(Error, Object=))} queryOptions
     * @param {function(Error, Object=)=} callback
     * @return {DummyFindOneAndUpdateQuery}
     */
    findOneAndUpdate: function(queryParams, updateObject, queryOptions, callback) {
        if (TypeUtil.isFunction(queryOptions)) {
            callback = queryOptions;
            queryOptions = {};
        }
        var query = new DummyFindOneAndUpdateQuery(this, queryParams, updateObject, queryOptions);
        if (callback) {
            return query.exec(callback);
        } else {
            return query;
        }
    },
    mapReduce: function() {
        throw new Error("DummyMongoose Not Implemented");
    },
    populate: function() {
        throw new Error("DummyMongoose Not Implemented");
    },

    /**
     * @param {Object} queryParams
     * @param {function(Error, Object)} callback
     * @returns {DummyRemoveQuery}
     */
    remove: function(queryParams, callback) {
        var query = new DummyRemoveQuery(this, queryParams);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }
    },
    update: function() {
        throw new Error("DummyMongoose Not Implemented");
    },
    where: function(queryParams, callback) {
        var query = new DummyWhereQuery(this, queryParams);
        if (callback) {
            query.exec(callback);
        } else {
            return query;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyMongooseModel', DummyMongooseModel);
