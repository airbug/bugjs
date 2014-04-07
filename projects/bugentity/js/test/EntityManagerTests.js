//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugentity.Entity')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntitySchema')
//@Require('bugentity.SchemaManager')
//@Require('bugentity.SchemaProperty')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Entity                      = bugpack.require('bugentity.Entity');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntitySchema                = bugpack.require('bugentity.EntitySchema');
var SchemaManager               = bugpack.require('bugentity.SchemaManager');
var SchemaProperty              = bugpack.require('bugentity.SchemaProperty');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var entityManagerBuildUpdateTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn            = bugyarn.yarn(this);
        yarn.spin([
            "setupTestEntityDeltaBuilder"
        ]);
        this.testId         = "testId";
        this.testCreatedAt  = new Date();
        this.testUpdatedAt  = new Date();
        this.testData       = {
            key: "value"
        };
        this.testSchema = new EntitySchema(Entity, "Entity");
        this.testSchema.addProperty(new SchemaProperty("id", "string", {
            primaryId: true
        }));
        this.testSchema.addProperty(new SchemaProperty("createdAt", "date", {}));
        this.testSchema.addProperty(new SchemaProperty("updatedAt", "date", {}));
        this.testSchema.addProperty(new SchemaProperty("data", "object", {}));
        this.testSchemaManager = new SchemaManager();
        this.testSchemaManager.processed = true;
        this.testSchemaManager.registerSchema(this.testSchema);
        this.testEntity = new Entity({
            id: this.testId,
            createdAt: this.testCreatedAt,
            updatedAt: this.testUpdatedAt,
            data: this.testData
        });
        this.testEntityManager = new EntityManager({}, this.testSchemaManager, {}, this.entityDeltaBuilder);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testEntity.commitDelta();
        this.testEntity.getEntityData().data.key = "newValue";
        var updateObject = this.testEntityManager.buildUpdateObject(this.testEntity, {});
        test.assertEqual(updateObject.$set["data.key"], "newValue",
            "Assert $set key and value are correct");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(entityManagerBuildUpdateTest).with(
    test().name("EntityManager - #buildUpdate Test")
);
