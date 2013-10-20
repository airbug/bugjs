//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugioc.BugIoc')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta         = bugpack.require('bugmeta.BugMeta');
var BugIoc          = bugpack.require('bugioc.BugIoc');
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
bugmeta.annotate(bugIocProcessTest).with(
    test().name("BugIoc - process() test")
);
