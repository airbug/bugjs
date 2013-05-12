//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
//@Require('MessageDefines')
//@Require('MessageSender')
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
var MessageSender   = bugpack.require('MessageSender');
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
 * 1) Instantiation of a MessageSender
 * 2) That the address and messageReceiver values are set correctly during instantiation
 */
var instantiateMessageSenderTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testMessageSender = new MessageSender();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessageSender.getMessageReceiver(), null,
            "Assert messageReceiver was set to null during instantiation");
    }
};
annotate(instantiateMessageSenderTest).with(
    test().name("MessageSender instantiation test")
);


/**
 * This tests
 * 1) That the sendMessage function correctly sends a message to the MessageReceiver on the default MESSAGE channel
 */
var messageSenderSendMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.receiveMessageCalled = false;
        this.testMessage = new Message();
        this.dummyMessageReceiver = {
            receiveMessage: function(message, channel) {
                _this.receiveMessageCalled = true;
                test.assertEqual(message, _this.testMessage,
                    "Assert message received by dummy was testMessage");
                test.assertEqual(channel, MessageDefines.MessageChannels.MESSAGE,
                    "Assert default message channel is MESSAGE");
            }
        };
        this.testMessageSender = new MessageSender();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageSender.setMessageReceiver(this.dummyMessageReceiver);
        this.testMessageSender.sendMessage(this.testMessage);
        test.assertEqual(this.receiveMessageCalled, true,
            "Assert that the receiveMessage function of the dummy was called");
    }
};
annotate(messageSenderSendMessageTest).with(
    test().name("MessageSender sendMessage test")
);


/**
 * This tests
 * 1) That the sendMessage function correctly sends a message to the MessageReceiver on the ERROR channel
 */
var messageSenderSendMessageErrorChannelTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.receiveMessageCalled = false;
        this.testMessage = new Message();
        this.dummyMessageReceiver = {
            receiveMessage: function(message, channel) {
                _this.receiveMessageCalled = true;
                test.assertEqual(message, _this.testMessage,
                    "Assert message received by dummy was testMessage");
                test.assertEqual(channel, MessageDefines.MessageChannels.ERROR,
                    "Assert channel is ERROR");
            }
        };
        this.testMessageSender = new MessageSender();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageSender.setMessageReceiver(this.dummyMessageReceiver);
        this.testMessageSender.sendMessage(this.testMessage, MessageDefines.MessageChannels.ERROR);
        test.assertEqual(this.receiveMessageCalled, true,
            "Assert that the receiveMessage function of the dummy was called");
    }
};
annotate(messageSenderSendMessageErrorChannelTest).with(
    test().name("MessageSender sendMessage ERROR channel test")
);
