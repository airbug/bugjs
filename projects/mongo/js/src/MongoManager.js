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

//@Export('mongo.MongoManager')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Obj                 = bugpack.require('Obj');
    var BugTrace            = bugpack.require('bugtrace.BugTrace');


    //-------------------------------------------------------------------------------
    // Simplify Reference
    //-------------------------------------------------------------------------------

    var $traceWithError     = BugTrace.$traceWithError;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MongoManager = Class.extend(Obj, {

        _name: "mongo.MongoManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @construvts
         * @param {*} model
         * @param {*} schema
         */
        _constructor: function(model, schema){

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.model      = model;

            /**
             * @private
             * @type {*}
             */
            this.schema     = schema;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getModel: function() {
            return this.model;
        },

        /**
         * @return {*}
         */
        getSchema: function() {
            return this.schema;
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
            this.schema.path(attribute).validate(validationFunction, errorMessage);
        },


        //-------------------------------------------------------------------------------
        // Mongo Model Methods
        //-------------------------------------------------------------------------------

        $where: function() {
            return this.model.$where.apply(this.model, arguments);
        },
        aggregate: function() {
            return this.model.aggregate.apply(this.model, arguments);
        },
        count: function() {
            return this.model.count.apply(this.model, arguments);
        },

        /**
         * @param {Object} createObject
         * @param {function(Exception, Object=)=} callback
         * @return {Promise}
         */
        create: function(createObject, callback) {
            if (callback) {
                this.model.create(createObject,  $traceWithError(function(error, dbObject) {
                    if (error) {
                        callback(new Exception("MongoDBError", {}, "An error occurred in MongoDB", [error]));
                    } else {
                        callback(null, dbObject);
                    }
                }));
            } else {
                return this.model.create(createObject);
            }
        },
        distinct: function() {
            return this.model.distinct.apply(this.model, arguments);
        },
        ensureIndexes: function() {
            return this.model.ensureIndexes.apply(this.model, arguments);
        },
        find: function() {
            return this.model.find.apply(this.model, arguments);
        },
        findById: function() {
            return this.model.findById.apply(this.model, arguments);
        },
        findByIdAndRemove: function() {
            return this.model.findByIdAndRemove.apply(this.model, arguments);
        },
        findByIdAndUpdate: function() {
            return this.model.findByIdAndUpdate.apply(this.model, arguments);
        },
        findOne: function() {
            return this.model.findOne.apply(this.model, arguments);
        },
        findOneAndRemove: function() {
            return this.model.findOneAndRemove.apply(this.model, arguments);
        },
        findOneAndUpdate: function() {
            return this.model.findOneAndUpdate.apply(this.model, arguments);
        },
        mapReduce: function() {
            return this.model.mapReduce.apply(this.model, arguments);
        },
        populate: function() {
            return this.model.populate.apply(this.model, arguments);
        },
        remove: function() {
            return this.model.remove.apply(this.model, arguments);
        },
        update: function() {
            return this.model.update.apply(this.model, arguments);
        },
        where: function() {
            return this.model.where.apply(this.model, arguments);
        },


        //-------------------------------------------------------------------------------
        // Mongo Schema Methods
        //-------------------------------------------------------------------------------

        pre: function() {
            return this.schema.pre.apply(this.schema, arguments);
        },
        post: function() {
            return this.schema.post.apply(this.schema, arguments);
        },
        virtual: function() {
            return this.schema.virtual.apply(this.schema, arguments);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.MongoManager', MongoManager);
});
