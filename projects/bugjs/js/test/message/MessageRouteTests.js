//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('MessageRoute')
//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MessageRoute    = bugpack.require('MessageRoute');
var Annotate        = bugpack.require('annotate.Annotate');
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
 * 1) Instantiation of a MessageRoute
 * 2) That the initialized, addressSet, and messagePropagator values were set correctly during instantiation
 */
var instantiateMessageRouteTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.dummyMessagePropagator = {

        };
        this.testMessageRoute = new MessageRoute(this.dummyMessagePropagator);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessageRoute.isInitialized(), false,
            "Assert 'initialized' defaults to false");
        test.assertEqual(this.testMessageRoute.getAddressSet().getCount(), 0,
            "Assert 'addressSet' defaults empty");
        test.assertEqual(this.testMessageRoute.getMessagePropagator(), this.dummyMessagePropagator,
            "Assert 'messagePropagator' was set correctly during instantiation");
    }
};
annotate(instantiateMessageRouteTest).with(
    test().name("MessageRoute instantiation test")
);
