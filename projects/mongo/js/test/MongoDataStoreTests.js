//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('mongo.DummyMongoose')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag          = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');
    var DummyMongoose           = bugpack.require('mongo.DummyMongoose');
    var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestTag.test;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupDummyMongoose", function(yarn) {
        yarn.wind({
            mongoose: new DummyMongoose()
        });
    });

    bugyarn.registerWinder("setupDummyMongoDataStore", function(yarn) {
        yarn.spin([
            "setupDummyMongoose",
            "setupTestLogger",
            "setupTestSchemaManager"
        ]);
        yarn.wind({
            mongoDataStore: new MongoDataStore(this.logger, this.schemaManager, this.mongoose)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------


    var mongoDataStoreInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupDummyMongoose",
                "setupTestLogger",
                "setupTestSchemaManager"
            ]);
            this.testMongoDataStore = new MongoDataStore(this.logger, this.schemaManager, this.mongoose);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testMongoDataStore, MongoDataStore),
                "Assert instance of MongoDataStore");
            test.assertEqual(this.testMongoDataStore.getLogger(), this.logger,
                "Assert .logger was set correctly");
            test.assertEqual(this.testMongoDataStore.getSchemaManager(), this.schemaManager,
                "Assert .schemaManager was set correctly");
            test.assertEqual(this.testMongoDataStore.getMongoose(), this.mongoose,
                "Assert .mongoose was set correctly");
        }
    };

    var mongoDataStoreProcessSchemaTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupDummyMongoDataStore"
            ]);
            this.testEntityClass    = new Class();
            this.testEntityName     = "testEntityName";
            this.testEntityOptions  = {
                embedded: true
            };
            this.testEntitySchema   = yarn.weave("testEntitySchema", [this.testEntityClass, this.testEntityName, this.testEntityOptions]);
            this.testEntitySchema.addProperty(yarn.weave("testSchemaProperty", ["testPropertyName", "string", {}]))
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.mongoDataStore.processed = true;
            this.mongoDataStore.processSchema(this.testEntitySchema);
            var mongooseModel   = this.mongoDataStore.getMongooseModelForName(this.testEntityName);
            var mongooseSchema  = mongooseModel.schema;
            var expectedSchemaObject = {
                testPropertyName: {
                    index: false,
                    required: false,
                    type: String,
                    unique: false
                }
            };
            test.assertEqual(JSON.stringify(mongooseSchema.schemaObject), JSON.stringify(expectedSchemaObject),
                "Assert processSchema is returning expected result");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(mongoDataStoreInstantiationTest).with(
        test().name("MongoDataStore - instantiation test")
    );

    bugmeta.tag(mongoDataStoreProcessSchemaTest).with(
        test().name("MongoDataStore - #processSchema test")
    );
});
