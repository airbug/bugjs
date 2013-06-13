//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('annotate.Annotate')
//@Require('bugioc.BugIoc')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate        = bugpack.require('annotate.Annotate');
var BugIoc          = bugpack.require('bugioc.BugIoc');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) that the callback for process() is called
 */
var bugIocProcessTest = {

    async: true,


    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.bugIoc = new BugIoc();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.bugIoc.process(function() {
            test.assertTrue(true,
                "Assert BugIoc.process() callback was successfully called");
            test.complete();
        })
    }
};
annotate(bugIocProcessTest).with(
    test().name("BugIoc - process() test")
);