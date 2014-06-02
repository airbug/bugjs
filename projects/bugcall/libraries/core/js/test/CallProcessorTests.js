//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugcall.CallProcessor')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CallProcessor           = bugpack.require('bugcall.CallProcessor');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestCallProcessor", function(yarn) {
    yarn.wind({
        callProcessor: new CallProcessor()
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var callProcessorInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCallProcessor      = new CallProcessor();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCallProcessor, CallProcessor),
            "Assert instance of CallProcessor");
        test.assertTrue(this.testCallProcessor.getCallPreProcessorSet().isEmpty(),
            "Assert that callPreProcessorSet is empty");
        test.assertTrue(this.testCallProcessor.getCallProcessorSet().isEmpty(),
            "Assert that callProcessorSet is empty");
    }
};
bugmeta.tag(callProcessorInstantiationTest).with(
    test().name("CallProcessor - instantiation test")
);
