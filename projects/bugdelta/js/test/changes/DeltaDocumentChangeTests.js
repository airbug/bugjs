//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugdelta.DeltaDocumentChange')
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

var DeltaDocumentChange     = bugpack.require('bugdelta.DeltaDocumentChange');
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

var deltaDocumentChangeInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testChangeType             = DeltaDocumentChange.ChangeTypes.DATA_SET;
        this.testPath                   = "some.path";
        this.testData                   = "data";
        this.testPreviousData           = "previousData";
        this.testDeltaDocumentChange    = new DeltaDocumentChange(this.testChangeType, this.testPath, this.testData, this.testPreviousData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testDeltaDocumentChange.getChangeType(), this.testChangeType,
            "Assert DeltaDocumentChange.changeType was set correctly");
        test.assertEqual(this.testDeltaDocumentChange.getPath(), this.testPath,
            "Assert DeltaDocumentChange.path was set correctly");
        test.assertEqual(this.testDeltaDocumentChange.getData(), this.testData,
            "Assert DeltaDocumentChange.data was set correctly");
        test.assertEqual(this.testDeltaDocumentChange.getPreviousData(), this.testPreviousData,
            "Assert DeltaDocumentChange.previousData was set correctly");
    }
};
bugmeta.annotate(deltaDocumentChangeInstantiationTest).with(
    test().name("DeltaDocumentChange - instantiation Test")
);
