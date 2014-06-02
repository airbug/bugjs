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

//@Export('mongo.DummyFindOneAndUpdateQuery')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('mongo.DummyMongoQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');
    var DummyMongoQuery     = bugpack.require('mongo.DummyMongoQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DummyMongoQuery}
     */
    var DummyFindOneAndUpdateQuery = Class.extend(DummyMongoQuery, {

        _name: "mongo.DummyFindOneAndUpdateQuery",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyMongooseModel} dummyMongooseModel
         * @param {Object} queryParams
         * @param {Object} updateObject
         * @param {Object} queryOptions
         */
        _constructor: function(dummyMongooseModel, queryParams, updateObject, queryOptions) {

            this._super(dummyMongooseModel);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.queryOptions       = queryOptions;

            /**
             * @private
             * @type {object}
             */
            this.queryParams        = queryParams;

            /**
             * @private
             * @type {boolean}
             */
            this.queryLean          = false;

            /**
             * @private
             * @type {Object}
             */
            this.updateObject       = updateObject;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} queryLean
         */
        lean: function(queryLean) {
            this.queryLean = queryLean;
            return this;
        },

        query: function() {
            var returnNew       = TypeUtil.isBoolean(this.queryOptions.new) ? this.queryOptions.new : true;
            var dbObject        = this.findOne(this.queryParams);
            var originalObject  = Obj.clone(dbObject, true);
            if (dbObject) {
                var updatedObject = this.updateDbObject(dbObject, this.updateObject);
                if (returnNew) {
                    return updatedObject;
                } else {
                    return originalObject;
                }
            } else {
                if (this.queryOptions.upsert) {
                    this.upsert(this.queryParams, this.updateObject);
                }
            }
            return null;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.DummyFindOneAndUpdateQuery', DummyFindOneAndUpdateQuery);
});
