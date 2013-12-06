//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('StackTraceUtil')
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
var StackTraceUtil  = bugpack.require('StackTraceUtil');
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
 *
 */
var generateStackFromCallerTest = {

    async: true,

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {

    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        function testFunction() {
            var stackTraceArray = StackTraceUtil.generateStackFromCaller();
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
bugmeta.annotate(generateStackFromCallerTest).with(
    test().name("Generate stack trace from caller test")
);
