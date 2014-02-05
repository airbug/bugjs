//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugcall.CallRequest')
//@Require('bugcall.CallRequestFactory')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var TypeUtil                = bugpack.require('TypeUtil');
var CallRequest             = bugpack.require('bugcall.CallRequest');
var CallRequestFactory      = bugpack.require('bugcall.CallRequestFactory');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var callRequestFactoryInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCallRequestFactory   = new CallRequestFactory();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCallRequestFactory, CallRequestFactory),
            "Assert testCallRequestFactory is an instance of CallRequestFactory");
    }
};
bugmeta.annotate(callRequestFactoryInstantiationTest).with(
    test().name("CallRequestFactory - instantiation Test")
);


var callRequestFactoryFactoryCallRequestTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCallRequestFactory   = new CallRequestFactory();
        this.testCallUuid       = "testCallUuid";
        this.testReconnect      = false;
        this.testRequestType    = "testRequestType";
        this.testRequestData    = {};
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var request = this.testCallRequestFactory.factoryCallRequest(this.testRequestType, this.testRequestData);
        test.assertTrue(Class.doesExtend(request, CallRequest),
            "Assert request returned a CallRequest");
        test.assertEqual(request.getType(), this.testRequestType,
            "Assert request type was set correctly");
        test.assertEqual(request.getData(), this.testRequestData,
            "Assert request data was set correctly");
    }
};
bugmeta.annotate(callRequestFactoryFactoryCallRequestTest).with(
    test().name("CallRequestFactory - #factoryCallRequest Test")
);
