//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.DeltaDocumentChange')
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
var DeltaDocumentChange     = bugpack.require('bugdelta.DeltaDocumentChange');
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
        this.testDeltaDocumentChange    = new DeltaDocumentChange();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testDeltaDocumentChange, DeltaDocumentChange),
            "Assert testDeltaDocumentChange is an instance of DeltaDocumentChange");
        test.assertEqual(this.testDeltaDocumentChange.getChangeType(), undefined,
            "Assert DeltaDocumentChange.changeType was NOT set");
        test.assertEqual(this.testDeltaDocumentChange.getPath(), undefined,
            "Assert DeltaDocumentChange.path was NOT set");
        test.assertEqual(this.testDeltaDocumentChange.getData(), undefined,
            "Assert DeltaDocumentChange.data was NOT set");
        test.assertEqual(this.testDeltaDocumentChange.getPreviousData(), undefined,
            "Assert DeltaDocumentChange.previousData was Not set");
    }
};
bugmeta.annotate(deltaDocumentChangeInstantiationWithoutParametersTest).with(
    test().name("DeltaDocumentChange - instantiation without parameters test")
);


var deltaDocumentChangeInstantiationWithParametersTest = {

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
bugmeta.annotate(deltaDocumentChangeInstantiationWithParametersTest).with(
    test().name("DeltaDocumentChange - instantiation with parameters test")
);
