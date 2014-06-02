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

//@Export('bugentity.EntityTagProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntitySchema')
//@Require('bugentity.SchemaIndex')
//@Require('bugentity.SchemaProperty')
//@Require('bugmeta.ITagProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var EntitySchema    = bugpack.require('bugentity.EntitySchema');
    var SchemaIndex     = bugpack.require('bugentity.SchemaIndex');
    var SchemaProperty  = bugpack.require('bugentity.SchemaProperty');
    var ITagProcessor   = bugpack.require('bugmeta.ITagProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ITagProcessor}
     */
    var EntityTagProcessor = Class.extend(Obj, {

        _name: "bugentity.EntityTagProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {SchemaManager} schemaManager
         */
        _constructor: function(schemaManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {SchemaManager}
             */
            this.schemaManager  = schemaManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

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
         * @param {EntityTag} entityTag
         */
        process: function(entityTag) {
            var entityConstructor   = entityTag.getTagReference();
            var entityClass         = entityConstructor.getClass();
            var entityName          = entityTag.getEntityName();
            if (!this.schemaManager.hasSchemaForClass(entityClass) && !this.schemaManager.hasSchemaForName(entityName)) {
                var schema = new EntitySchema(entityClass, entityName, {
                    embedded: entityTag.getEntityEmbedded(),
                    stored: entityTag.getEntityStored()
                });

                entityTag.getEntityProperties().forEach(function(propertyTag) {
                    schema.addProperty(new SchemaProperty(propertyTag.getPropertyName(), propertyTag.getPropertyType(), {
                        collectionOf: propertyTag.getPropertyCollectionOf(),
                        'default': propertyTag.getPropertyDefault(),
                        id: propertyTag.isPropertyId(),
                        indexed: propertyTag.isPropertyIndexed(),
                        populates: propertyTag.getPropertyPopulates(),
                        primaryId: propertyTag.isPropertyPrimaryId(),
                        required: propertyTag.isPropertyRequired(),
                        stored: propertyTag.isPropertyStored(),
                        unique: propertyTag.isPropertyUnique()
                    }));
                });

                entityTag.getEntityIndexes().forEach(function(indexAnnotation) {
                    schema.addIndex(new SchemaIndex(indexAnnotation.getIndexPropertyObject(), {
                        unique: indexAnnotation.isIndexUnique()
                    }));
                });

                this.schemaManager.registerSchema(schema);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(EntityTagProcessor, ITagProcessor);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugentity.EntityTagProcessor', EntityTagProcessor);
});
