//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

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

var schemaPropertyInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testName       = "testName";
        this.testType       = "testType";
        this.testOptions    = {
            collectionOf: "testCollectionOf",
            id: true,
            indexed: true,
            populates: true,
            stored: true,
            unique: true
        };
        this.testSchemaProperty = new SchemaProperty(this.testName, this.testType, this.testOptions);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testSchemaProperty.getCollectionOf(), this.testOptions.collectionOf,
            "Assert SchemaProperty.collectionOf was set correctly");
        test.assertEqual(this.testSchemaProperty.getName(), this.testName,
            "Assert SchemaProperty.name was set correctly");
        test.assertEqual(this.testSchemaProperty.getType(), this.testType,
            "Assert SchemaProperty.type was set correctly");
        test.assertEqual(this.testSchemaProperty.isId(), this.testOptions.id,
            "Assert SchemaProperty.id was set correctly");
        test.assertEqual(this.testSchemaProperty.isIndexed(), this.testOptions.indexed,
            "Assert SchemaProperty.indexed was set correctly");
        test.assertEqual(this.testSchemaProperty.isPopulates(), this.testOptions.populates,
            "Assert SchemaProperty.populates was set correctly");
        test.assertEqual(this.testSchemaProperty.isStored(), this.testOptions.stored,
            "Assert SchemaProperty.stored was set correctly");
        test.assertEqual(this.testSchemaProperty.isUnique(), this.testOptions.unique,
            "Assert SchemaProperty.unique was set correctly");
    }
};
bugmeta.annotate(schemaPropertyInstantiationTest).with(
    test().name("SchemaProperty - instantiation Test")
);