//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
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

var Message         = bugpack.require('Message');
var MessageDefines  = bugpack.require('MessageDefines');
var MessageReceiver = bugpack.require('MessageReceiver');
var TypeUtil        = bugpack.require('TypeUtil');
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
 * 1) Instantiation of a MessageReceiver
 * 2) That the receiverFunction and receiverContext values were set correctly during instantiation
 */
var instantiateMessageReceiverTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testReceiverContext = {};
        this.testReceiverFunction = function() {};
        this.testMessageReceiver = new MessageReceiver(this.testReceiverFunction, this.testReceiverContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessageReceiver.getReceiverFunction(), this.testReceiverFunction,
            "Assert receiverFunction was set correctly during instantiation");
        test.assertEqual(this.testMessageReceiver.getReceiverContext(), this.testReceiverContext,
            "Assert receiverContext was set correctly during instantiation");
        test.assertTrue(TypeUtil.isString(this.testMessageReceiver.getAddress()),
            "Assert address was set to a string during instantiation");

        test.assertNotEqual(this.testMessageReceiver.getReceiverFunction(), function() {},
            "Assert receiverFunction does not equal any old function");
        test.assertNotEqual(this.testMessageReceiver.getReceiverContext(), {},
            "Assert receiverContext does not equal any old object");
    }
};
annotate(instantiateMessageReceiverTest).with(
    test().name("MessageReceiver instantiation test")
);


/**
 * This tests
 * 1) That the receiverFunction is executed within the receiverContext when receiveMessage is called
 */
var messageReceiverReceiveMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessage = new Message();
        this.receiverFunctionCalled = false;
        this.testReceiverContext = {
            receiverFunction: function(message, channel) {
                _this.receiverFunctionCalled = true;
                test.assertEqual(message, _this.testMessage,
                    "Assert that the message received by the receiver function was the test Message");
                test.assertEqual(channel, _this.testChannel,
                    "Assert that the channel received by the receiver function was the test channel");
                test.assertEqual(this, _this.testReceiverContext,
                    "Assert that the context of the receiverFunction is the testReceiverContext");
            }
        };
        this.testMessageReceiver = new MessageReceiver(this.testReceiverContext.receiverFunction, this.testReceiverContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageReceiver.receiveMessage(this.testMessage, this.testChannel);
        test.assertEqual(this.receiverFunctionCalled, true,
            "Assert that the receiverFunction was called");
    }
};
annotate(messageReceiverReceiveMessageTest).with(
    test().name("MessageReceiver receiveMessage test")
);
