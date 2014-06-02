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

//@Export('mongo.DummyRemoveQuery')

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
    var DummyRemoveQuery = Class.extend(DummyMongoQuery, {

        _name: "mongo.DummyRemoveQuery",


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
             * @type {object}
             */
            this.queryParams     = queryParams;

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

        query: function() {
            var dataObject      = this.getDummyMongooseModel().getCollection();
            var removeCount     = 0;
            for (var id in dataObject) {
                if (dataObject.hasOwnProperty(id)) {
                    var entity = dataObject[id];
                    var matches = 0;
                    var expectedMatches = 0;
                    for (var key in this.queryParams) {
                        if (this.queryParams.hasOwnProperty(key)) {
                            expectedMatches++;
                            var expectedValue = this.queryParams[key];
                            if (entity[key] === expectedValue) {
                                matches++;
                            }
                        }
                    }
                    if (matches === expectedMatches) {
                        removeCount++;
                        delete dataObject[id];
                    }
                }
            }
            return removeCount;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.DummyRemoveQuery', DummyRemoveQuery);
});
