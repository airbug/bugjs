//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.ForEachParallel')
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
var ForEachParallel =   bugpack.require('bugflow.ForEachParallel');
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
 * 1) That each item in the array is iterated over in ForEachParallel execute
 */
var bugflowExecuteForEachParallelTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testIndex = -1;
        this.testArray = [
            "value1",
            "value2",
            "value3"
        ];
        this.testIteratorMethod = function(flow, value, index) {
            _this.testIndex++;
            test.assertEqual(index, _this.testIndex,
                "Assert index is in correct order. Should be '" + _this.testIndex + "'");
            test.assertEqual(value, _this.testArray[_this.testIndex],
                "Assert value matches test index value");
            flow.complete();
        };
        this.forEachParallel = new ForEachParallel(this.testArray, this.testIteratorMethod);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.forEachParallel.execute(function(error) {
            if (!error) {
                test.assertEqual(_this.testIndex, 2,
                    "Assert that the ForEachParallel iterated 3 times");
            } else {
                test.error(error);
            }
        });
    }
};
annotate(bugflowExecuteForEachParallelTest).with(
    test().name("BugFlow ForEachParallel execute test")
);
