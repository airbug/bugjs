//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.Schema')
//@Require('bugentity.SchemaProperty')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var Schema          = bugpack.require('bugentity.Schema');
var SchemaProperty  = bugpack.require('bugentity.SchemaProperty');


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
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SchemaManager}
         */
        this.schemaManager  = schemaManager;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {EntityAnnotation} entityAnnotation
     */
    process: function(entityAnnotation) {
        var entityClass = entityAnnotation.getAnnotationReference();
        var entityName  = entityAnnotation.getEntityName();
        if (!this.schemaManager.hasSchemaForClass(entityClass) && !this.schemaManager.hasSchemaForName(entityName)) {
            var schema = new Schema(entityClass, entityName);

            entityAnnotation.getEntityProperties().forEach(function(propertyAnnotation) {
                schema.addProperty(new SchemaProperty(propertyAnnotation.getPropertyName(), propertyAnnotation.getPropertyType(), {
                    collectionOf: propertyAnnotation.getPropertyCollectionOf(),
                    id: propertyAnnotation.isPropertyId(),
                    indexed: propertyAnnotation.isPropertyIndexed(),
                    populates: propertyAnnotation.getPropertyPopulates(),
                    primaryId: propertyAnnotation.isPropertyPrimaryId(),
                    stored: propertyAnnotation.isPropertyStored(),
                    unique: propertyAnnotation.isPropertyUnique()
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
