//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('Pair')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var Pair            = bugpack.require('Pair');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiate a simple Pair
 */
var pairInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPair = new Pair();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testPair.getA(), undefined,
            "Assert that Pair.a is undefined");
        test.assertEqual(this.testPair.getB(), undefined,
            "Assert that Pair.b is undefined");
        test.assertTrue(Class.doesExtend(this.testPair, Pair),
            "Assert that the testPair extends Pair");
    }
};
bugmeta.annotate(pairInstantiationTest).with(
    test().name("Pair - instantiation test")
);


/**
 * This tests
 * 1) Instantiate a simple Pair with values
 */
var pairInstantiationWithValuesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testA    = "testA";
        this.testB    = "testB";
        this.testPair = new Pair(this.testA, this.testB);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testPair.getA(), this.testA,
            "Assert that Pair.a is testA");
        test.assertEqual(this.testPair.getB(), this.testB,
            "Assert that Pair.b is testB");
    }
};
bugmeta.annotate(pairInstantiationWithValuesTest).with(
    test().name("Pair - instantiation with values test")
);


/**
 * This tests
 * 1) Check if contains function works
 */
var pairContainsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testA    = "testA";
        this.testB    = "testB";
        this.testC    = "testC";
        this.testPair = new Pair(this.testA, this.testB);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testPair.contains(this.testA), true,
            "Assert that Pair#contains returns true when checked for 'testA'");
        test.assertEqual(this.testPair.contains(this.testB), true,
            "Assert that Pair#contains returns true when checked for 'testB'");
        test.assertEqual(this.testPair.contains(this.testC), false,
            "Assert that Pair#contains returns false when checked for 'testC'");

    }
};
bugmeta.annotate(pairContainsTest).with(
    test().name("Pair - #contains test")
);
