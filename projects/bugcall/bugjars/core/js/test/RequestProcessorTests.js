//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugcall.RequestProcessor')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var RequestProcessor        = bugpack.require('bugcall.RequestProcessor');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestRequestProcessor", function(yarn) {
    yarn.wind({
        requestProcessor: new RequestProcessor()
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var requestProcessorInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testRequestProcessor   = new RequestProcessor();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testRequestProcessor, RequestProcessor),
            "Assert instance of RequestProcessor");
        test.assertTrue(this.testRequestProcessor.getRequestPreProcessorSet().isEmpty(),
            "Assert that requestPreProcessorSet is empty");
        test.assertTrue(this.testRequestProcessor.getRequestProcessorSet().isEmpty(),
            "Assert that requestProcessorSet is empty");
    }
};
bugmeta.annotate(requestProcessorInstantiationTest).with(
    test().name("RequestProcessor - instantiation test")
);
