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

//@Export('mongo.DummyMongoose')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('mongo.DummyMongooseModel')
//@Require('mongo.DummyMongooseObjectId')
//@Require('mongo.DummyMongooseSchema')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Map                     = bugpack.require('Map');
    var Obj                     = bugpack.require('Obj');
    var DummyMongooseModel      = bugpack.require('mongo.DummyMongooseModel');
    var DummyMongooseObjectId   = bugpack.require('mongo.DummyMongooseObjectId');
    var DummyMongooseSchema     = bugpack.require('mongo.DummyMongooseSchema');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DummyMongoose = Class.extend(Obj, {

        _name: "mongo.DummyMongoose",


        //-------------------------------------------------------------------------------
        // Class Properties
        //-------------------------------------------------------------------------------

        Schema: DummyMongooseSchema,

        Types: {
            ObjectId: DummyMongooseObjectId
        },


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {{}}
             */
            this.db             = {};

            /**
             * @private
             * @type {Map.<string, DummyMongooseModel>}
             */
            this.modelMap       = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @param {string} collectionType
         * @returns {Object}
         */
        getCollection: function(collectionType) {
            return this.db[collectionType];
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} url
         */
        connect: function(url) {
            //do nothing
        },

        /**
         * @param {string} modelName
         * @param {DummyMongooseSchema} mongooseSchema
         * @return {DummyMongooseModel}
         */
        model: function(modelName, mongooseSchema) {
            if (mongooseSchema) {
                var mongooseModel = new DummyMongooseModel(mongooseSchema, modelName);
                mongooseModel.dummyMongoose = this;
                this.modelMap.put(modelName, mongooseModel);
                this.db[modelName.toLowerCase()] = {};
                return mongooseModel;
            } else {
                return this.modelMap.get(modelName);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.DummyMongoose', DummyMongoose);
});
