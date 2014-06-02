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

//@Export('mongo.DummyWhereQuery')

//@Require('Class')
//@Require('mongo.DummyMongoQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var DummyMongoQuery     = bugpack.require('mongo.DummyMongoQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {DummyMongoQuery}
     */
    var DummyWhereQuery = Class.extend(DummyMongoQuery, {

        _name: "mongo.DummyWhereQuery",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyMongooseModel} dummyMongooseModel
         * @param {Object} queryParams
         */
        _constructor: function(dummyMongooseModel, queryParams) {

            this._super(dummyMongooseModel);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.queryParams     = queryParams;

            /**
             * @private
             * @type {Array<string>} queryIn
             */
            this.queryIn        = undefined;

            /**
             * @private
             * @type {boolean}
             */
            this.queryLean      = false;
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

        'in': function(items) {
            this.queryIn = items;
            return this;
        },

        query: function() {
            var dataObject = this.getDummyMongooseModel().getCollection();
            var results = [];
            var whereField = this.queryParams;
            for (var id in dataObject) {
                if (dataObject.hasOwnProperty(id)) {
                    var dataRecord = dataObject[id];
                    if (dataRecord.hasOwnProperty(whereField)) {
                        var fieldValue = dataRecord[whereField].toString();
                        if (this.queryIn.indexOf(fieldValue) != -1) {
                            results.push(dataRecord);
                        }
                    }
                }
            }
            return results;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.DummyWhereQuery', DummyWhereQuery);
});
