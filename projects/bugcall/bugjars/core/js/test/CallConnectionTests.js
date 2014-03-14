//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugcall.CallConnection')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CallConnection          = bugpack.require('bugcall.CallConnection');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
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

bugyarn.registerWeaver("testCallConnection", function(yarn) {
    yarn.spin([
        "setupTestMarshaller"
    ]);
    var dummySocketIoConnection = yarn.weave("dummySocketIoConnection");
    return new CallConnection(dummySocketIoConnection, this.marshaller);
});

bugyarn.registerWinder("setupTestCallConnection", function(yarn) {
    yarn.spin([
        "setupDummySocketIoConnection",
        "setupTestMarshaller"
    ]);
    yarn.wind({
        callConnection: new CallConnection(this.socketIoConnection, this.marshaller)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var callConnectionInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupDummySocketIoConnection",
            "setupTestMarshaller"
        ]);
        this.testCallConnection     = new CallConnection(this.socketIoConnection, this.marshaller)
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCallConnection, CallConnection),
            "Assert instance of CallConnection");
        test.assertEqual(this.testCallConnection.getSocketConnection(), this.socketIoConnection,
            "Assert that .socketConnection was set correctly");
        test.assertEqual(this.testCallConnection.getMarshaller(), this.marshaller,
            "Assert that .marshaller was set correctly");
    }
};
bugmeta.annotate(callConnectionInstantiationTest).with(
    test().name("CallConnection - instantiation test")
);
