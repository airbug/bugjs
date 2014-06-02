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

//@Export('mongo.DummyFindByIdAndUpdateQuery')

//@Require('Class')
//@Require('Obj')
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
    var DummyMongoQuery     = bugpack.require('mongo.DummyMongoQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DummyMongoQuery}
     */
    var DummyFindByIdAndUpdateQuery = Class.extend(DummyMongoQuery, {

        _name: "mongo.DummyFindByIdAndUpdateQuery",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyMongooseModel} dummyMongooseModel
         * @param {string} queryId
         * @param {Object} updateObject
         */
        _constructor: function(dummyMongooseModel, queryId, updateObject) {

            this._super(dummyMongooseModel);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.queryId        = queryId;

            /**
             * @private
             * @type {boolean}
             */
            this.queryLean      = false;

            /**
             * @private
             * @type {Object}
             */
            this.updateObject   = updateObject;
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
            var dbObject = this.findById(this.queryId);
            if (dbObject) {
                return this.updateDbObject(dbObject, this.updateObject);
            } else {
                return null;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.DummyFindByIdAndUpdateQuery', DummyFindByIdAndUpdateQuery);
});
