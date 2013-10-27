//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugtrace.BugTrace')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var BugTrace        = bugpack.require('bugtrace.BugTrace');
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
bugmeta.annotate(createExceptionTest).with(
    test().name("BugTrace: createException test")
);
