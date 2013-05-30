//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
//@Require('MessageBroadcaster')
//@Require('MessageDefines')
//@Require('MessageReceiver')
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

var Message             = bugpack.require('Message');
var MessageBroadcaster  = bugpack.require('MessageBroadcaster');
var MessageDefines      = bugpack.require('MessageDefines');
var TypeUtil            = bugpack.require('TypeUtil');
var Annotate            = bugpack.require('annotate.Annotate');
var BugDouble           = bugpack.require('bugdouble.BugDouble');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


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
 * 1) Instantiation of a MessageBroadcaster
 * 2) That the address value is set correctly and the messageReceiver count is 0 after instantiation
 */
var instantiateMessageBroadcasterTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testMessageBroadcaster = new MessageBroadcaster();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessageBroadcaster.getMessagePropagatorCount(), 0,
            "Assert messageReceiver was set to null during instantiation");
    }
};
annotate(instantiateMessageBroadcasterTest).with(
    test().name("MessageBroadcaster instantiation test")
);

/**
 * This tests
 * 1) Adding a MessagePropagator
 * 2) Receiving a simple Message and broadcasting that message
 */
var messageBroadcasterSimpleAddMessagePropagatorPropagateMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessageTopic = "testMessageTopic";
        this.testMessage = new Message(this.testMessageTopic);
        this.dummyMessagePropagator = {
            propagateMessage: function(message, channel) {
                test.assertEqual(message, _this.testMessage,
                    "Assert received message is equal to testMessage");
                test.assertEqual(channel, _this.testChannel,
                    "Assert receiver channel is equal to testChannel");
            },
            addEventPropagator: function(eventPropagator) {
                test.assertEqual(eventPropagator, _this.testMessageBroadcaster,
                    "Assert that parentDispatcher is the MessageBroadcaster");
            }
        };
        this.spyMessagePropagator = spyOnObject(this.dummyMessagePropagator);
        this.testMessageBroadcaster = new MessageBroadcaster();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageBroadcaster.addMessagePropagator(this.dummyMessagePropagator);
        test.assertTrue(this.spyMessagePropagator.getSpy("addEventPropagator").wasCalled(),
            "Assert addEventPropagator was called");
        this.testMessageBroadcaster.propagateMessage(this.testMessage, this.testChannel);
        test.assertTrue(this.spyMessagePropagator.getSpy("propagateMessage").wasCalled(),
            "Assert propagateMessage of dummyMessagePropagator was called.");
    }
};
annotate(messageBroadcasterSimpleAddMessagePropagatorPropagateMessageTest).with(
    test().name("MessageBroadcaster simple addMessagePropagator and propagateMessage test")
);


/**
 * This tests
 * 1) Adding multiple MessageReceivers
 * 2) Receiving a simple Message and broadcasting that message tp multiple receivers
 */
var messageBroadcasterMultipleAddMessageReceiverPropagateMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.dummyMessagePropagator1 = {
            propagateMessage: function(message, channel) {
                test.assertEqual(message, _this.testMessage,
                    "Assert received message is equal to testMessage");
                test.assertEqual(channel, _this.testChannel,
                    "Assert receiver channel is equal to testChannel");
            },
            addEventPropagator: function(eventPropagator) {
                test.assertEqual(eventPropagator, _this.testMessageBroadcaster,
                    "Assert that parentDispatcher is the MessageBroadcaster");
            }
        };
        this.spyMessagePropagator1 = spyOnObject(this.dummyMessagePropagator1);

        this.dummyMessagePropagator2 = {
            propagateMessage: function(message, channel) {
                test.assertEqual(message, _this.testMessage,
                    "Assert received message is equal to testMessage");
                test.assertEqual(channel, _this.testChannel,
                    "Assert receiver channel is equal to testChannel");
            },
            addEventPropagator: function(eventPropagator) {
                test.assertEqual(eventPropagator, _this.testMessageBroadcaster,
                    "Assert that parentDispatcher is the MessageBroadcaster");
            }
        };
        this.spyMessagePropagator2 = spyOnObject(this.dummyMessagePropagator2);

        this.testMessageTopic = "testMessageTopic";
        this.testMessage = new Message(this.testMessageTopic);
        this.testMessageBroadcaster = new MessageBroadcaster();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageBroadcaster.addMessagePropagator(this.dummyMessagePropagator1);
        test.assertTrue(this.spyMessagePropagator1.getSpy("addEventPropagator").wasCalled(),
            "Assert that addEventPropagator of dummyMessagePropagator1 was called");
        this.testMessageBroadcaster.addMessagePropagator(this.dummyMessagePropagator2);
        test.assertTrue(this.spyMessagePropagator2.getSpy("addEventPropagator").wasCalled(),
            "Assert that addEventPropagator of dummyMessagePropagator2 was called");
        this.testMessageBroadcaster.propagateMessage(this.testMessage, this.testChannel);
        test.assertTrue(this.spyMessagePropagator1.getSpy("propagateMessage").wasCalled(),
            "Assert that propagateMessage of dummyMessagePropagator1 was called.");
        test.assertTrue(this.spyMessagePropagator2.getSpy("propagateMessage").wasCalled(),
            "Assert that propagateMessage of dummyMessagePropagator2 was called.");
    }
};
annotate(messageBroadcasterMultipleAddMessageReceiverPropagateMessageTest).with(
    test().name("MessageBroadcaster multiple addMessagePropagator and propagateMessage test")
);
