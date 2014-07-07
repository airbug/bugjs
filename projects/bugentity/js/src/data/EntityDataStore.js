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

//@Export('bugentity.EntityDataStore')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug     = bugpack.require('Bug');
    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var Set     = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var EntityDataStore = Class.extend(Obj, {

        _name: "bugentity.EntityDataStore",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {SchemaManager} schemaManager
         */
        _constructor: function(logger, schemaManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Logger}
             */
            this.logger                 = logger;

            /**
             * @private
             * @type {SchemaManager}
             */
            this.schemaManager          = schemaManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {SchemaManager}
         */
        getSchemaManager: function() {
            return this.schemaManager;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        configureSchemas: function() {
            var _this = this;
            var embeddedSchemaSet   = new Set();
            var primarySchemaSet    = new Set();

            // TODO BRN: This only works for a double layer schema system. Really need to implement a system that determines
            // the dependency structure of the Schemas

            this.schemaManager.getSchemaCollection().forEach(function(entitySchema) {
                if (entitySchema.getEntityEmbedded()) {
                    embeddedSchemaSet.add(entitySchema);
                } else {
                    primarySchemaSet.add(entitySchema);
                }
            });
            embeddedSchemaSet.forEach(function(entitySchema) {
                _this.configureSchema(entitySchema);
            });
            primarySchemaSet.forEach(function(entitySchema) {
                _this.configureSchema(entitySchema);
            })
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {EntitySchema} entitySchema
         */
        configureSchema: function(entitySchema) {
            throw new Bug("AbstractMethodNotImplemented", {}, "Abstract method 'configureSchema' has not been implemented");
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityDataStore', EntityDataStore);
});
