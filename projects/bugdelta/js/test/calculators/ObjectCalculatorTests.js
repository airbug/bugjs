//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.Delta')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.ObjectCalculator')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Delta                   = bugpack.require('bugdelta.Delta');
var DeltaBuilder            = bugpack.require('bugdelta.DeltaBuilder');
var ObjectCalculator        = bugpack.require('bugdelta.ObjectCalculator');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Setup Methods
//-------------------------------------------------------------------------------

var setupObjectCalculatorTest = function(setupObject) {
    setupObject.testDelta                   = new Delta();
    setupObject.testDeltaBuilder            = new DeltaBuilder();
    setupObject.testObjectCalculator        = new ObjectCalculator(setupObject.testDeltaBuilder);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var objectCalculatorInstantiationWithoutParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testObjectCalculator    = new ObjectCalculator();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testObjectCalculator, ObjectCalculator),
            "Assert testObjectCalculator is an instance of ObjectCalculator");
        test.assertEqual(this.testObjectCalculator.getDeltaBuilder(), undefined,
            "Assert testObjectCalculator.deltaBuilder was NOT set");
    }
};
bugmeta.annotate(objectCalculatorInstantiationWithoutParametersTest).with(
    test().name("ObjectCalculator - instantiation without parameters test")
);


var objectCalculatorInstantiationWithParametersTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDeltaBuilder           = new DeltaBuilder();
        this.testObjectCalculator       = new ObjectCalculator(this.testDeltaBuilder);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testObjectCalculator.getDeltaBuilder(), this.testDeltaBuilder,
            "Assert testObjectCalculator.deltaBuilder was set correctly");
    }
};
bugmeta.annotate(objectCalculatorInstantiationWithParametersTest).with(
    test().name("ObjectCalculator - instantiation with parameters test")
);

var objectCalculatorCalculateDeltaNoChangeEmptyObjectTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupObjectCalculatorTest(this);
        this.testObject1 = {};
        this.testObject2 = {};
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testObjectCalculator.calculateDelta(this.testDelta, "", this.testObject1, this.testObject2);
        test.assertTrue(this.testDelta.isEmpty(),
            "Assert that no changes were found");
    }
};
bugmeta.annotate(objectCalculatorCalculateDeltaNoChangeEmptyObjectTest).with(
    test().name("ObjectCalculator - calculate delta no change empty object test")
);

var objectCalculatorCalculateDeltaNoChangeTypesTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupObjectCalculatorTest(this);
        var time    = new Date().getTime();
        this.noChangeValues = [
            new String("string"),
            new Number(1),
            "string",
            0,
            100,
            true,
            false,
            undefined,
            null,
            new Date(time)
        ];
        this.noChangeComparison = [
            new String("string"),
            new Number(1),
            "string",
            0,
            100,
            true,
            false,
            undefined,
            null,
            new Date(time)
        ];
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        for (var i = 0, size = this.noChangeValues.length; i < size; i++) {
            var delta       = new Delta();
            var value       = this.noChangeValues[i];
            var comparison  = this.noChangeComparison[i];
            var testObject1 = {
                testProperty: value
            };
            var testObject2 = {
                testProperty: comparison
            }
            this.testObjectCalculator.calculateDelta(delta, "", testObject1, testObject2);
            test.assertTrue(delta.isEmpty(),
                "Assert that no changes were found when comparing a property value of - value:" + value + " comparison:" + comparison);
        }

    }
};
bugmeta.annotate(objectCalculatorCalculateDeltaNoChangeTypesTest).with(
    test().name("ObjectCalculator - calculate delta no change types test")
);

var objectCalculatorCalculateDeltaPropertySetChangeTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testPropertyValue = "testPropertyValue";
        setupObjectCalculatorTest(this)
        this.testObject1 = {};
        this.testObject2 = {
            newProperty: this.testPropertyValue
        };
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testObjectCalculator.calculateDelta(this.testDelta, "", this.testObject1, this.testObject2);
        test.assertEqual(this.testDelta.getChangeCount(), 1,
            "Assert there is one change");
    }
};
bugmeta.annotate(objectCalculatorCalculateDeltaPropertySetChangeTest).with(
    test().name("ObjectCalculator - calculate delta property set change test")
);
