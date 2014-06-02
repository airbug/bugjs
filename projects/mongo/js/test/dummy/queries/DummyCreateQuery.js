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

//@Export('mongo.DummyCreateQuery')

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
    var DummyCreateQuery = Class.extend(DummyMongoQuery, {

        _name: "mongo.DummyCreateQuery",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DummyMongooseModel} dummyMongooseModel
         * @param {Object} createObject
         */
        _constructor: function(dummyMongooseModel, createObject) {

            this._super(dummyMongooseModel);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.createObject   = createObject;

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

        /**
         * @return {*}
         */
        query: function() {
            return this.create(this.createObject);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.DummyCreateQuery', DummyCreateQuery);
});
