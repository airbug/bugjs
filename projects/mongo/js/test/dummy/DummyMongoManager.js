//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('mongo')

//@Export('DummyMongoManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('mongo.DummyFindByIdQuery')
//@Require('mongo.DummyFindByIdAndUpdateQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Map                             = bugpack.require('Map');
var Obj                             = bugpack.require('Obj');
var UuidGenerator                   = bugpack.require('UuidGenerator');
var DummyFindByIdQuery              = bugpack.require('mongo.DummyFindByIdQuery');
var DummyFindByIdAndUpdateQuery     = bugpack.require('mongo.DummyFindByIdAndUpdateQuery');



//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var DummyMongoManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function(modelName, dataObject) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.dataObject = dataObject || {};

        /**
         * @private
         * @type {string}
         */
        this.modelName  = modelName;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {mongoose.Model}
     */
    getModel: function() {
        //TODO
    },

    /**
     * @return {mongoose.Schema}
     */
    getSchema: function() {
       //TODO
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    configure: function(callback) {
        callback()
    },

    /**
     * @private
     * @param {string} attribute
     * @param {function(value) | function(value, response)} validationFunction
     * @param {string} errorMessage
     */
    validate: function(attribute, validationFunction, errorMessage){
        //TODO
    },

    $where: function() {

    },
    aggregate: function() {

    },
    count: function() {

    },

    /**
     * @param {Object} dbObject
     * @param {function(Error, Object)} callback
     */
    create: function(dbObject, callback) {
        var dbObjectClone = Obj.clone(dbObject);
        dbObjectClone._id = this.generateId();
        this.dataObject[dbObjectClone._id.toString()] = dbObjectClone;
        callback(undefined, dbObjectClone);
    },

    distinct: function() {

    },
    ensureIndexes: function() {

    },
    find: function() {

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
    findByIdAndRemove: function() {

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
    findOne: function() {

    },
    findOneAndRemove: function() {

    },
    findOneAndUpdate: function() {

    },
    mapReduce: function() {

    },
    populate: function() {

    },
    remove: function() {

    },
    update: function() {

    },
    where: function() {

    },
    pre: function() {

    },
    post: function() {

    },
    virtual: function() {
        //TODO BRN:
    },



    //-------------------------------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------------------------------

    /**
     * @returns {Object}
     */
    generateId: function() {
        var idObject = {
            id: UuidGenerator.generateHexUuid(),
            toString: function() {
                return idObject.id;
            }
        };
        return idObject;
    },

    /**
     * @returns {Object}
     */
    getDataObject: function() {
        return this.dataObject;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('mongo.DummyMongoManager', DummyMongoManager);
