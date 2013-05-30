//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
//@Require('MessageDefines')
//@Require('MessageProxy')
//@Require('TypeUtil')
//@Require('annotate.Annotate')
//@Require('bugdouble.BugDouble')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Message         = bugpack.require('Message');
var MessageDefines  = bugpack.require('MessageDefines');
var MessageProxy    = bugpack.require('MessageProxy');
var TypeUtil        = bugpack.require('TypeUtil');
var Annotate        = bugpack.require('annotate.Annotate');
var BugDouble       = bugpack.require('bugdouble.BugDouble');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var spyOnObject = BugDouble.spyOnObject;
var test        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiation of a MessageProxy
 * 2) That the messagePropagator value is set correctly during instantiation
 */
var instantiateMessageProxyTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testMessageProxy = new MessageProxy();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessageProxy.getMessagePropagator(), null,
            "Assert messagePropagator was set to null during instantiation");
    }
};
annotate(instantiateMessageProxyTest).with(
    test().name("MessageProxy instantiation test")
);


/**
 * This tests
 * 1) That the propagateMessage function correctly sends a message to the proxied MessageReceiver
 */
var messageProxyPropagateMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessage = new Message();
        this.dummyMessagePropagator = {
            propagateMessage: function(message, channel) {
                test.assertEqual(message, _this.testMessage,
                    "Assert message propagated by dummy was testMessage");
                test.assertEqual(channel, _this.testChannel,
                    "Assert default message channel is MESSAGE");
            },
            addEventPropagator: function(eventPropagator) {
                test.assertEqual(eventPropagator, _this.testMessageProxy);
            }
        };
        this.spyMessagePropagator = spyOnObject(this.dummyMessagePropagator);
        this.testMessageProxy = new MessageProxy();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageProxy.setMessagePropagator(this.dummyMessagePropagator);
        test.assertEqual(this.spyMessagePropagator.getSpy("addEventPropagator").wasCalled(), true,
            "Assert that addEventPropagator of dummyMessagePropagator was called");
        this.testMessageProxy.propagateMessage(this.testMessage, this.testChannel);
        test.assertEqual(this.spyMessagePropagator.getSpy("propagateMessage").wasCalled(), true,
            "Assert that the propagateMessage of dummyMessagePropagator was called");
    }
};
annotate(messageProxyPropagateMessageTest).with(
    test().name("MessageProxy propagateMessage test")
);
