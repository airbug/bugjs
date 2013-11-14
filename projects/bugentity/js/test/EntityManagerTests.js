//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugentity.Entity')
//@Require('bugentity.EntityManager')
//@Require('bugentity.Schema')
//@Require('bugentity.SchemaManager')
//@Require('bugentity.SchemaProperty')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Entity                  = bugpack.require('bugentity.Entity');
var EntityManager           = bugpack.require('bugentity.EntityManager');
var Schema                  = bugpack.require('bugentity.Schema');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var SchemaProperty          = bugpack.require('bugentity.SchemaProperty');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var entityManagerBuildUpdateTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testId         = "testId";
        this.testCreatedAt  = new Date();
        this.testUpdatedAt  = new Date();
        this.testData       = {
            key: "value"
        };
        this.testSchema = new Schema(Entity, "Entity");
        this.testSchema.addProperty(new SchemaProperty("id", "string", {
            primaryId: true
        }));
        this.testSchema.addProperty(new SchemaProperty("createdAt", "date", {}));
        this.testSchema.addProperty(new SchemaProperty("updatedAt", "date", {}));
        this.testSchema.addProperty(new SchemaProperty("data", "object", {}));
        this.testSchemaManager = new SchemaManager();
        this.testSchemaManager.registerSchema(this.testSchema);
        this.testEntity = new Entity({
            id: this.testId,
            createdAt: this.testCreatedAt,
            updatedAt: this.testUpdatedAt,
            data: this.testData
        });
        this.testEntityManager = new EntityManager({}, this.testSchemaManager, {});
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testEntity.commitDelta();
        this.testEntity.getDeltaDocument().getData().data.key = "newValue";
        var updateObject = this.testEntityManager.buildUpdateObject(this.testEntity, {});
        test.assertEqual(updateObject.$set["data.key"], "newValue",
            "Assert $set key and value are correct");
    }
};
bugmeta.annotate(entityManagerBuildUpdateTest).with(
    test().name("EntityManager - #buildUpdate Test")
);
