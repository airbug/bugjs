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
var MessageReceiver     = bugpack.require('MessageReceiver');
var TypeUtil            = bugpack.require('TypeUtil');
var Annotate            = bugpack.require('annotate.Annotate');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


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
        test.assertEqual(this.testMessageBroadcaster.getMessageReceiverCount(), 0,
            "Assert messageReceiver was set to null during instantiation");
        test.assertTrue(TypeUtil.isString(this.testMessageBroadcaster.getAddress()),
            "Assert address was set to a string during instantiation");
    }
};
annotate(instantiateMessageBroadcasterTest).with(
    test().name("MessageBroadcaster instantiation test")
);

/**
 * This tests
 * 1) Adding a MessageReceiver
 * 2) Receiving a simple Message and broadcasting that message
 */
var messageBroadcasterSimpleAddMessageReceiverReceiveMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testReceiverFunctionCalled = false;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessageTopic = "testMessageTopic";
        this.testMessage = new Message(this.testMessageTopic);
        this.testReceiverFunction = function(message, channel) {
            _this.testReceiverFunctionCalled = true;
            test.assertEqual(message, _this.testMessage,
                "Assert received message is equal to testMessage");
            test.assertEqual(channel, _this.testChannel,
                "Assert receiver channel is equal to testChannel");
        };
        this.testMessageReceiver = new MessageReceiver(this.testReceiverFunction);
        this.testMessageBroadcaster = new MessageBroadcaster();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageBroadcaster.addMessageReceiver(this.testMessageReceiver);
        this.testMessageBroadcaster.receiveMessage(this.testMessage, this.testChannel);
        test.assertTrue(this.testReceiverFunctionCalled,
            "Assert receiver function was called.");
    }
};
annotate(messageBroadcasterSimpleAddMessageReceiverReceiveMessageTest).with(
    test().name("MessageBroadcaster simple addMessageReceiver and receiveMessage test")
);


/**
 * This tests
 * 1) Adding multiple MessageReceivers
 * 2) Receiving a simple Message and broadcasting that message tp multiple receivers
 */
var messageBroadcasterMultipleAddMessageReceiverReceiveMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;

        this.testReceiverFunction1Called = false;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testReceiverFunction1 = function(message, channel) {
            _this.testReceiverFunction1Called = true;
            test.assertEqual(message, _this.testMessage,
                "Assert received message is equal to testMessage");
            test.assertEqual(channel, _this.testChannel,
                "Assert receiver channel is equal to testChannel");
        };
        this.testMessageReceiver1 = new MessageReceiver(this.testReceiverFunction1);

        this.testReceiverFunction2Called = false;
        this.testReceiverFunction2 = function(message, channel) {
            _this.testReceiverFunction2Called = true;
            test.assertEqual(message, _this.testMessage,
                "Assert received message is equal to testMessage");
            test.assertEqual(channel, _this.testChannel,
                "Assert receiver channel is equal to testChannel");
        };
        this.testMessageReceiver2 = new MessageReceiver(this.testReceiverFunction2);

        this.testMessageTopic = "testMessageTopic";
        this.testMessage = new Message(this.testMessageTopic);
        this.testMessageBroadcaster = new MessageBroadcaster();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageBroadcaster.addMessageReceiver(this.testMessageReceiver1);
        this.testMessageBroadcaster.addMessageReceiver(this.testMessageReceiver2);
        this.testMessageBroadcaster.receiveMessage(this.testMessage, this.testChannel);
        test.assertTrue(this.testReceiverFunction1Called,
            "Assert receiver function1 was called.");
        test.assertTrue(this.testReceiverFunction2Called,
            "Assert receiver function2 was called.");
    }
};
annotate(messageBroadcasterMultipleAddMessageReceiverReceiveMessageTest).with(
    test().name("MessageBroadcaster multiple addMessageReceiver and receiveMessage test")
);
