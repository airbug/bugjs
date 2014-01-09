//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.DocumentChange')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var DocumentChange          = bugpack.require('bugdelta.DocumentChange');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var deltaDocumentChangeInstantiationWithoutParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDocumentChange    = new DocumentChange();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testDocumentChange, DocumentChange),
            "Assert testDocumentChange is an instance of DocumentChange");
        test.assertEqual(this.testDocumentChange.getChangeType(), undefined,
            "Assert DocumentChange.changeType was NOT set");
        test.assertEqual(this.testDocumentChange.getPath(), undefined,
            "Assert DocumentChange.path was NOT set");
        test.assertEqual(this.testDocumentChange.getData(), undefined,
            "Assert DocumentChange.data was NOT set");
        test.assertEqual(this.testDocumentChange.getPreviousData(), undefined,
            "Assert DocumentChange.previousData was Not set");
    }
};
bugmeta.annotate(deltaDocumentChangeInstantiationWithoutParametersTest).with(
    test().name("DocumentChange - instantiation without parameters test")
);


var deltaDocumentChangeInstantiationWithParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testChangeType             = DocumentChange.ChangeTypes.DATA_SET;
        this.testPath                   = "some.path";
        this.testData                   = "data";
        this.testPreviousData           = "previousData";
        this.testDocumentChange         = new DocumentChange(this.testChangeType, this.testPath, this.testData, this.testPreviousData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testDocumentChange.getChangeType(), this.testChangeType,
            "Assert DocumentChange.changeType was set correctly");
        test.assertEqual(this.testDocumentChange.getPath(), this.testPath,
            "Assert DocumentChange.path was set correctly");
        test.assertEqual(this.testDocumentChange.getData(), this.testData,
            "Assert DocumentChange.data was set correctly");
        test.assertEqual(this.testDocumentChange.getPreviousData(), this.testPreviousData,
            "Assert DocumentChange.previousData was set correctly");
    }
};
bugmeta.annotate(deltaDocumentChangeInstantiationWithParametersTest).with(
    test().name("DocumentChange - instantiation with parameters test")
);
