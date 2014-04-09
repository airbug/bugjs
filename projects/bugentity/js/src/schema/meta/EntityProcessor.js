//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugentity.EntityProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntitySchema')
//@Require('bugentity.SchemaIndex')
//@Require('bugentity.SchemaProperty')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var EntitySchema        = bugpack.require('bugentity.EntitySchema');
var SchemaIndex         = bugpack.require('bugentity.SchemaIndex');
var SchemaProperty      = bugpack.require('bugentity.SchemaProperty');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
     * @param {EntityAnnotation} entityAnnotation
     */
    process: function(entityAnnotation) {
        var entityClass = entityAnnotation.getAnnotationReference();
        var entityName  = entityAnnotation.getEntityName();
        if (!this.schemaManager.hasSchemaForClass(entityClass) && !this.schemaManager.hasSchemaForName(entityName)) {
            var schema = new EntitySchema(entityClass, entityName, {
                embedded: entityAnnotation.getEntityEmbedded(),
                stored: entityAnnotation.getEntityStored()
            });

            entityAnnotation.getEntityProperties().forEach(function(propertyAnnotation) {
                schema.addProperty(new SchemaProperty(propertyAnnotation.getPropertyName(), propertyAnnotation.getPropertyType(), {
                    collectionOf: propertyAnnotation.getPropertyCollectionOf(),
                    'default': propertyAnnotation.getPropertyDefault(),
                    id: propertyAnnotation.isPropertyId(),
                    indexed: propertyAnnotation.isPropertyIndexed(),
                    populates: propertyAnnotation.getPropertyPopulates(),
                    primaryId: propertyAnnotation.isPropertyPrimaryId(),
                    required: propertyAnnotation.isPropertyRequired(),
                    stored: propertyAnnotation.isPropertyStored(),
                    unique: propertyAnnotation.isPropertyUnique()
                }));
            });

            entityAnnotation.getEntityIndexes().forEach(function(indexAnnotation) {
                schema.addIndex(new SchemaIndex(indexAnnotation.getIndexPropertyObject(), {
                    unique: indexAnnotation.isIndexUnique()
                }));
            });

            this.schemaManager.registerSchema(schema);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityProcessor', EntityProcessor);
