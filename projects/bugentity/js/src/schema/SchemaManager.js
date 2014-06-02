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

//@Export('bugentity.SchemaManager')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugentity.EntityTagProcessor')
//@Require('bugentity.EntityTagScan')
//@Require('bugioc.IProcessModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var EntityTagProcessor     = bugpack.require('bugentity.EntityTagProcessor');
    var EntityTagScan          = bugpack.require('bugentity.EntityTagScan');
    var IProcessModule      = bugpack.require('bugioc.IProcessModule');
    var ModuleTag    = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta              = BugMeta.context();
    var module               = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IProcessModule}
     */
    var SchemaManager = Class.extend(Obj, {

        _name: "bugentity.SchemaManager",


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
             * @type {Map.<Class, Schema>}
             */
            this.classToSchemaMap   = new Map();

            /**
             * @private
             * @type {Map.<string, Schema>}
             */
            this.nameToSchemaMap    = new Map();

            /**
             * @private
             * @type {boolean}
             */
            this.processed          = false;
        },


        //-------------------------------------------------------------------------------
        // IProcessModule Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        processModule: function() {
            if (!this.processed) {
                this.processed = true;
                var entityTagScan = new EntityTagScan(bugmeta, new EntityTagProcessor(this));
                entityTagScan.scanAll();
            } else {
                throw new Bug("IllegalState", {}, "Already processed module SchemaManager");
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {ICollection.<EntitySchema>}
         */
        getSchemaCollection: function() {
            this.assertProcessed();
            return this.nameToSchemaMap.getValueCollection();
        },

        /**
         * @param {Class} _class
         * @return {EntitySchema}
         */
        getSchemaByClass: function(_class) {
            this.assertProcessed();
            return this.classToSchemaMap.get(_class);
        },

        /**
         * @param {string} name
         * @return {EntitySchema}
         */
        getSchemaByName: function(name) {
            this.assertProcessed();
            return this.nameToSchemaMap.get(name);
        },

        /**
         * @param {Class} _class
         * @return {boolean}
         */
        hasSchemaForClass: function(_class) {
            this.assertProcessed();
            return this.classToSchemaMap.containsKey(_class);
        },

        /**
         * @param {string} name
         * @return {boolean}
         */
        hasSchemaForName: function(name) {
            this.assertProcessed();
            return this.nameToSchemaMap.containsKey(name);
        },

        /**
         * @param {EntitySchema} schema
         */
        registerSchema: function(schema) {
            if (this.hasSchemaForClass(schema.getEntityClass())) {
                throw new Error("Schema already registered for class - class:", schema.getEntityClass());
            }
            if (this.hasSchemaForName(schema.getEntityName())) {
                throw new Error("Schema already registered for entity name - name:", schema.getEntityName());
            }
            this.classToSchemaMap.put(schema.getEntityClass(), schema);
            this.nameToSchemaMap.put(schema.getEntityName(), schema);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        assertProcessed: function() {
            if (!this.processed) {
                throw new Bug("AssertFailed", {}, "Module 'SchemaManager' has not been processed");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(SchemaManager, IProcessModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SchemaManager).with(
        module("schemaManager")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.SchemaManager', SchemaManager);
});
