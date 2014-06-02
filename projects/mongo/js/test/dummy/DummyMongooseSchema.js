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

//@Export('mongo.DummyMongooseSchema')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Obj                             = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DummyMongooseSchema = Class.extend(Obj, {

        _name: "mongo.DummyMongooseSchema",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} schemaObject
         */
        _constructor: function(schemaObject) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.schemaObject   = schemaObject
        },


        //-------------------------------------------------------------------------------
        // Mongoose Methods
        //-------------------------------------------------------------------------------

        index: function(indexObject, indexOptions) {
            //TODO BRN:
        },
        pre: function() {
            //TODO BRN:
        },
        post: function() {
            //TODO BRN:
        },
        virtual: function() {
            //TODO BRN:
        }
    });


    DummyMongooseSchema.Types = {
        Mixed: function() {},
        ObjectId: function() {}
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('mongo.DummyMongooseSchema', DummyMongooseSchema);
});
