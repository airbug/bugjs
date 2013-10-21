//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugioc.IocContext')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta         = bugpack.require('bugmeta.BugMeta');
var IocContext      = bugpack.require('bugioc.IocContext');
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
 * 1) that the callback for initialize() is called when there are no configs
 */
var bugIocContextInitializeWithNoConfigurationsTest = {

    async: true,


    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.iocContext = new IocContext();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.iocContext.initialize(function() {
            test.assertTrue(true,
                "Assert iocContext.initialize() callback was successfully called when there's no configs");
            test.complete();
        })
    }
};
bugmeta.annotate(bugIocContextInitializeWithNoConfigurationsTest).with(
    test().name("IocContext - initialize() with no configurations test")
);
