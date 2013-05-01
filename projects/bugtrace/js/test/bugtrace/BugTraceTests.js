//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('annotate.Annotate')
//@Require('bugtrace.BugTrace')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Annotate =          bugpack.require('annotate.Annotate');
var BugTrace =          bugpack.require('bugtrace.BugTrace');
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
 *
 */
var generateStackFromCallerTest = {

    async: true,

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.bugTrace = new BugTrace();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        function testFunction() {
            var stackTraceArray = _this.bugTrace.generateStackFromCaller();
            console.log("stackTraceArray:", stackTraceArray);

            test.assertEqual(stackTraceArray[0], "function testFunction()",
                "Assert that the 0 index function is 'testFunction'");
            test.assertEqual(stackTraceArray[1], "function ()",
                "Assert that the 1 index function is anonymous function");
            test.assertEqual(stackTraceArray[2], "function listOnTimeout()",
                "Assert that the 2 index function is 'listOnTimeout'");
        }
        setTimeout(function() {
            testFunction();
            test.complete();
        }, 0);
    }
};
annotate(generateStackFromCallerTest).with(
    test().name("Generate stack trace from caller test")
);

/**
 *
 */
var createExceptionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.bugTrace = new BugTrace();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {

        var error = this.bugTrace.createException();
        var isError = error instanceof Error;
        test.assertTrue(isError, "Assert createException returns an error");
    }
};
annotate(createExceptionTest).with(
    test().name("BugTrace: createException test")
);
