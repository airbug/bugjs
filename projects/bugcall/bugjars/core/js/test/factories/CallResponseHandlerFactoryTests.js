//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugcall.CallResponseHandler')
//@Require('bugcall.CallResponseHandlerFactory')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var TypeUtil                        = bugpack.require('TypeUtil');
var CallResponseHandler             = bugpack.require('bugcall.CallResponseHandler');
var CallResponseHandlerFactory      = bugpack.require('bugcall.CallResponseHandlerFactory');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                         = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var bugyarn                         = BugYarn.context();
var test                            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestCallResponseHandlerFactory", function(yarn) {
    yarn.wind({
        callResponseHandlerFactory: new CallResponseHandlerFactory()
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var callResponseHandlerFactoryInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCallResponseHandlerFactory     = new CallResponseHandlerFactory();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCallResponseHandlerFactory, CallResponseHandlerFactory),
            "Assert testCallResponseHandlerFactory is an instance of CallResponseHandlerFactory");
    }
};
bugmeta.annotate(callResponseHandlerFactoryInstantiationTest).with(
    test().name("CallResponseHandlerFactory - instantiation Test")
);

var callResponseHandlerFactoryFactoryCallResponseHandlerTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn                = bugyarn.yarn(this);
        yarn.spin([
            "setupTestCallResponseHandlerFactory"
        ]);
        this.testResponseHandlerFunction    = function() {};
        this.testResponseHandlerContext     = {};
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var responseHandler = this.callResponseHandlerFactory.factoryCallResponseHandler(this.testResponseHandlerFunction, this.testResponseHandlerContext);
        test.assertTrue(Class.doesExtend(responseHandler, CallResponseHandler),
            "Assert factory method returned a CallResponseHandler");
        test.assertEqual(responseHandler.getResponseHandlerContext(), this.testResponseHandlerContext,
            "Assert responseHandler.responseHandlerContext was set correctly");
        test.assertEqual(responseHandler.getResponseHandlerFunction(), this.testResponseHandlerFunction,
            "Assert responseHandler.responseHandlerFunction was set correctly");
    }
};
bugmeta.annotate(callResponseHandlerFactoryFactoryCallResponseHandlerTest).with(
    test().name("CallResponseHandlerFactory - #factoryCallResponseHandler Test")
);