//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
//@RequirE('MessageDefines')
//@Require('MessageReceiver')
//@Require('MessageRouter')
//@Require('annotate.Annotate')
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
 * 1) Adding a MessageReceiver to MessageRouter
 * 2) Receiving a simple Message and routing that message
 */
var messageRouterSimpleAddMessageReceiverReceiveMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testReceiverFunctionCalled = false;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testReceiverFunction = function(message, channel) {
            _this.testReceiverFunctionCalled = true;
            test.assertEqual(message, _this.testMessage,
                "Assert received message is equal to testMessage");
            test.assertEqual(channel, _this.testChannel,
                "Assert that the channel received by the receiver function was the test channel");
        };
        this.testMessageReceiver = new MessageReceiver(this.testReceiverFunction);

        this.testMessageTopic = "testMessageTopic";
        this.testMessage = new Message(this.testMessageTopic);

        this.testMessageRouter = new MessageRouter();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageRouter.addMessageReceiver(this.testMessageReceiver);
        this.testMessageReceiver.receiveMessage(this.testMessage, this.testChannel);
        test.assertTrue(this.testReceiverFunctionCalled,
            "Assert receiver function was called.");
    }
};
annotate(messageRouterSimpleAddMessageReceiverReceiveMessageTest).with(
    test().name("MessageRouter simple addMessageReceiver and receiveMessage test")
);


/**
 * This tests
 * 1) Adding multiple MessageReceivers to a MessageRouter
 * 2) Receiving a simple Message and routing that message to the right receiver
 */
var messageRouterMultipleAddMessageReceiverReceiveMessageTest = {

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
                "Assert that the channel received by the receiver function was the test channel");
        };
        this.testMessageReceiver1 = new MessageReceiver(this.testReceiverFunction1);

        this.testReceiverFunction2Called = false;
        this.testReceiverFunction2 = function(message, channel) {
            _this.testReceiverFunction2Called = true;
            test.assertEqual(message, _this.testMessage,
                "Assert received message is equal to testMessage");
            test.assertEqual(channel, _this.testChannel,
                "Assert that the channel received by the receiver function was the test channel");
        };
        this.testMessageReceiver2 = new MessageReceiver(this.testReceiverFunction2);

        this.testMessageTopic = "testMessageTopic";
        this.testMessage = new Message(this.testMessageTopic);
        this.testMessage.setDestinationAddress(this.testMessageReceiver1.getAddress());
        this.testMessageRouter = new MessageRouter();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageRouter.addMessageReceiver(this.testMessageReceiver1);
        this.testMessageRouter.addMessageReceiver(this.testMessageReceiver2);
        this.testMessageRouter.receiveMessage(this.testMessage, this.testChannel);
        test.assertTrue(this.testReceiverFunction1Called,
            "Assert receiver function1 was called.");
        test.assertFalse(this.testReceiverFunction2Called,
            "Assert receiver function2 was NOT called.");
    }
};
annotate(messageRouterMultipleAddMessageReceiverReceiveMessageTest).with(
    test().name("MessageRouter multiple addMessageReceiver and receiveMessage test")
);
