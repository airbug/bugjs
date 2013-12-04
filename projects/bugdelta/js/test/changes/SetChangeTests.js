//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.SetChange')
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
var SetChange               = bugpack.require('bugdelta.SetChange');
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

var setChangeInstantiationWithoutParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSetChange    = new SetChange();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testSetChange, SetChange),
            "Assert testSetChange is an instance of SetChange");
        test.assertEqual(this.testSetChange.getChangeType(), undefined,
            "Assert SetChange.changeType was NOT set");
        test.assertEqual(this.testSetChange.getPath(), undefined,
            "Assert SetChange.path was NOT set");
        test.assertEqual(this.testSetChange.getSetValue(), undefined,
            "Assert SetChange.setValue was NOT set");
    }
};
bugmeta.annotate(setChangeInstantiationWithoutParametersTest).with(
    test().name("SetChange - instantiation without parameters test")
);


var setChangeInstantiationWithParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testChangeType             = SetChange.ChangeTypes.DATA_SET;
        this.testPath                   = "some.path";
        this.testSetValue               = "setValue";
        this.testSetChange              = new SetChange(this.testChangeType, this.testPath, this.testSetValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testSetChange.getChangeType(), this.testChangeType,
            "Assert SetChange.changeType was set correctly");
        test.assertEqual(this.testSetChange.getPath(), this.testPath,
            "Assert SetChange.path was set correctly");
        test.assertEqual(this.testSetChange.getSetValue(), this.testSetValue,
            "Assert SetChange.setValue was set correctly");
    }
};
bugmeta.annotate(setChangeInstantiationWithParametersTest).with(
    test().name("SetChange - instantiation with parameters test")
);
