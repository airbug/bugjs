//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
//@Require('MessageDefines')
//@Require('MessageReceiver')
//@Require('MessageRouter')
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
var MessageRouter   = bugpack.require('MessageRouter');
var MessageReceiver = bugpack.require('MessageReceiver');
var Annotate        = bugpack.require('annotate.Annotate');
var BugDouble       = bugpack.require('bugdouble.BugDouble');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate        = Annotate.annotate;
var spyOnFunction   = BugDouble.spyOnFunction;
var spyOnObject     = BugDouble.spyOnObject;
var test            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Adding a MessagePropagator to MessageRouter
 */
var messageRouterSimpleAddMessagePropagatorTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.dummyMessagePropagator = {
            addEventPropagator: function(eventPropagator) {
            }
        };
        this.spyDummyMessagePropagator = spyOnObject(this.dummyMessagePropagator);
        this.testMessageRouter = new MessageRouter();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageRouter.addMessagePropagator(this.dummyMessagePropagator);
        test.assertTrue(this.spyDummyMessagePropagator.getSpy("addEventPropagator").wasCalled(),
            "Assert dummy's addEventPropagator function was called");
        test.assertTrue(this.testMessageRouter.hasMessagePropagator(this.dummyMessagePropagator),
            "Assert messageRouter has a messagePropagator that matches the dummy");
    }
};
annotate(messageRouterSimpleAddMessagePropagatorTest).with(
    test().name("MessageRouter simple addMessagePropagator test")
);


/**
 * This tests
 * 1) Adding multiple MessageReceivers to a MessageRouter
 * 2) Receiving a simple Message and routing that message to the right receiver
 */
var messageRouterMultipleAddMessageReceiverPropagateMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testReceiverContext1 = {
            receiverFunction: function(message, channel) {
                test.assertEqual(this, _this.testReceiverContext1,
                    "Assert that the receiver context is the test context");
                test.assertEqual(message, _this.testMessage,
                    "Assert that the received message is the test message");
                test.assertEqual(channel, _this.testChannel,
                    "Assert that the received channel is the test channel");
            }
        };
        this.spyReceiverContext1 = spyOnObject(this.testReceiverContext1);
        this.testMessageReceiver1 = new MessageReceiver(this.testReceiverContext1.receiverFunction, this.testReceiverContext1);

        this.testReceiverContext2 = {
            receiverFunction: function(message, channel) {}
        };
        this.spyReceiverContext2 = spyOnObject(this.testReceiverContext2);
        this.testMessageReceiver2 = new MessageReceiver(this.testReceiverContext2.receiverFunction, this.testReceiverContext2);
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessageTopic = "testMessageTopic";
        this.testMessage = new Message(this.testMessageTopic);
        this.testMessage.setReceiverAddress(this.testMessageReceiver1.getAddress());
        this.testMessageRouter = new MessageRouter();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageRouter.addMessagePropagator(this.testMessageReceiver1);
        this.testMessageRouter.addMessagePropagator(this.testMessageReceiver2);
        this.testMessageReceiver1.turnOn();
        this.testMessageReceiver2.turnOn();
        this.testMessageRouter.propagateMessage(this.testMessage, this.testChannel);
        test.assertTrue(this.spyReceiverContext1.getSpy("receiverFunction").wasCalled(),
            "Assert receiverFunction on testReceiverContext1 was called.");
        test.assertTrue(this.spyReceiverContext2.getSpy("receiverFunction").wasNotCalled(),
            "Assert receiverFunction on testReceiverContext2 was NOT called.");
    }
};
annotate(messageRouterMultipleAddMessageReceiverPropagateMessageTest).with(
    test().name("MessageRouter multiple addMessageReceiver and propagateMessage test")
);
