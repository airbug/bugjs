//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.Flow')
//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Flow =              bugpack.require('bugflow.Flow');
var Annotate =          bugpack.require('annotate.Annotate');
var TestAnnotation =    bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests..
 * 1) That the Flow is marked as executed after execute is called
 */
var bugflowExecuteFlowTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.flow = new Flow();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.flow.execute();
        test.assertEqual(this.flow.hasExecuted(), true,
            "Assert flow has executed");
    }
};
annotate(bugflowExecuteFlowTest).with(
    test().name("BugFlow Flow execute without extension test")
);
