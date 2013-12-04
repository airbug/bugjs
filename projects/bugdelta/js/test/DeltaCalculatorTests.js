//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.DeltaCalculator')
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
var DeltaCalculator         = bugpack.require('bugdelta.DeltaCalculator');
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

var deltaCalculatorInstantiationWithoutParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDeltaCalculator            = new DeltaCalculator();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testDeltaCalculator, DeltaCalculator),
            "Assert testDeltaCalculator is an instance of DeltaCalculator");
        test.assertEqual(this.testDeltaCalculator.getDeltaBuilder(), undefined,
            "Assert testDeltaCalculator.deltaBuilder was NOT set");
    }
};
bugmeta.annotate(deltaCalculatorInstantiationWithoutParametersTest).with(
    test().name("DeltaCalculator - instantiation without parameters test")
);


var deltaCalculatorInstantiationWithParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDeltaBuilder               = {};
        this.testDeltaCalculator            = new DeltaCalculator(this.testDeltaBuilder);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testDeltaCalculator.getDeltaBuilder(), this.testDeltaBuilder,
            "Assert testDeltaCalculator.deltaBuilder was set correctly");
    }
};
bugmeta.annotate(deltaCalculatorInstantiationWithParametersTest).with(
    test().name("DeltaCalculator - instantiation with parameters test")
);
