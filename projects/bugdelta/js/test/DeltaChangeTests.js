//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.DeltaChange')
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
var DeltaChange             = bugpack.require('bugdelta.DeltaChange');
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

var deltaChangeInstantiationWithoutParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDeltaChange            = new DeltaChange();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testDeltaChange, DeltaChange),
            "Assert testDeltaChange is an instance of DeltaChange");
        test.assertEqual(this.testDeltaChange.getChangeType(), undefined,
            "Assert testDeltaChange.changeType was NOT set");
        test.assertEqual(this.testDeltaChange.getPath(), undefined,
            "Assert testDeltaChange.path was NOT set");
    }
};
bugmeta.annotate(deltaChangeInstantiationWithoutParametersTest).with(
    test().name("DeltaChange - instantiation without parameters test")
);


var deltaChangeInstantiationWithParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testChangeType             = "testChangeType";
        this.testPath                   = "some.path";
        this.testDeltaChange            = new DeltaChange(this.testChangeType, this.testPath);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testDeltaChange.getChangeType(), this.testChangeType,
            "Assert testDeltaChange.changeType was set correctly");
        test.assertEqual(this.testDeltaChange.getPath(), this.testPath,
            "Assert testDeltaChange.path was set correctly");
    }
};
bugmeta.annotate(deltaChangeInstantiationWithParametersTest).with(
    test().name("DeltaChange - instantiation with parameters test")
);


var deltaChangeSetPathTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testPath                   = "some.path";
        this.testDeltaChange            = new DeltaChange();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testDeltaChange.getPath(), undefined,
            "Assert testDeltaChange.path was NOT set");
        this.testDeltaChange.setPath(this.testPath);
        test.assertEqual(this.testDeltaChange.getPath(), this.testPath,
            "Assert testDeltaChange.path was set correctly");
    }
};
bugmeta.annotate(deltaChangeSetPathTest).with(
    test().name("DeltaChange - #setPath test")
);
