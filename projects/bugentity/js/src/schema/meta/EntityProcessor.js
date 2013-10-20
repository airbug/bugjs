//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugentity')

//@Export('EntityProcessor')

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityScan')
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
var EntityScan      = bugpack.require('bugentity.EntityScan');
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
        var entityClass = entityAnnotation.getReference();
        var entityName  = entityAnnotation.getEntityName();
        if (!this.schemaManager.hasSchemaForClass(entityClass) && !this.schemaManager.hasSchemaForName(entityName)) {
            var schema = new Schema(entityClass, entityName);
            var foundId = false;
            entityAnnotation.getProperties().forEach(function(propertyAnnotation) {
                schema.addProperty(new SchemaProperty(propertyAnnotation.getPropertyName(), propertyAnnotation.getPropertyType(), {
                    collectionOf: propertyAnnotation.getPropertyCollectionOf(),
                    id: propertyAnnotation.isPropertyId(),
                    indexed: propertyAnnotation.isIndexed(),
                    unique: propertyAnnotation.isUnique()
                }));

                if (propertyAnnotation.isId()) {
                    if (!foundId) {
                        foundId = true;
                    } else {
                        throw new Error("Schema already has an id");
                    }
                }
            });

            if (foundId === false) {
                throw new Error("No properties in Schema were labeled as an 'id'. One and only one property must " +
                    "be labeled as an 'id'")
            }
            this.schemaManager.registerSchema(schema);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugentity.EntityProcessor', EntityProcessor);
