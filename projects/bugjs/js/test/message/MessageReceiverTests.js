//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
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

var Message         = bugpack.require('Message');
var MessageDefines  = bugpack.require('MessageDefines');
var MessageReceiver = bugpack.require('MessageReceiver');
var TypeUtil        = bugpack.require('TypeUtil');
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
        test.assertTrue(TypeUtil.isBoolean(this.testMessageReceiver.isReceiverOn()),
            "Assert that messageOn was set to to a boolean during instantiation");
        test.assertFalse(this.testMessageReceiver.isReceiverOn(),
            "Assert that messageOn was set correctly during instantiation");

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
 * 1) Turning on the MessageReceiver
 */
var messageReceiverTurnOnTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.listenerFunction = spyOnFunction(function(event) {
            test.assertEqual(event.getData().address, _this.testMessageReceiver.getAddress(),
                "Assert that the address received in the ADDRESS_REGISTERED event matches the address of the receiver");
        });
        this.testMessageReceiver = new MessageReceiver(function() {});
        this.testMessageReceiver.addEventListener(MessageReceiver.EventTypes.ADDRESS_REGISTERED, this.listenerFunction);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessageReceiver.isReceiverOn(), false,
            "Assert that messageReceiver is not on");
        this.testMessageReceiver.turnOn();
        test.assertEqual(this.testMessageReceiver.isReceiverOn(), true,
            "Assert that the messageReceiver is on after calling turnOn()");
        test.assertEqual(this.listenerFunction.wasCalled(), true,
            "Assert that the listenerFunction was called");
    }
};
annotate(messageReceiverTurnOnTest).with(
    test().name("MessageReceiver turnOn() test")
);


/**
 * This tests
 * 1) That the receiverFunction is executed within the receiverContext when propagateMessage is called
 */
var messageReceiverPropagateMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessage = new Message();
        this.testReceiverContext = {
            receiverFunction: function(message, channel) {
                test.assertEqual(message, _this.testMessage,
                    "Assert that the message received by the receiver function was the test Message");
                test.assertEqual(channel, _this.testChannel,
                    "Assert that the channel received by the receiver function was the test channel");
                test.assertEqual(this, _this.testReceiverContext,
                    "Assert that the context of the receiverFunction is the testReceiverContext");
            }
        };
        this.spyReceiverContext = spyOnObject(this.testReceiverContext);
        this.testMessageReceiver = new MessageReceiver(this.testReceiverContext.receiverFunction, this.testReceiverContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageReceiver.turnOn();
        this.testMessageReceiver.propagateMessage(this.testMessage, this.testChannel);
        test.assertEqual(this.spyReceiverContext.getSpy("receiverFunction").wasCalled(), true,
            "Assert that the receiverFunction was called");
    }
};
annotate(messageReceiverPropagateMessageTest).with(
    test().name("MessageReceiver propagateMessage test")
);


/**
 * This tests
 * 1) That the receiverFunction is NOT executed within the receiverContext when propagateMessage is called and the receiver is off
 */
var messageReceiverPropagateMessageReceiverOffTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessage = new Message();
        this.testReceiverContext = {
            receiverFunction: function(message, channel) {
                _this.receiverFunctionCalled = true;
            }
        };
        this.spyReceiverContext = spyOnObject(this.testReceiverContext);
        this.testMessageReceiver = new MessageReceiver(this.testReceiverContext.receiverFunction, this.testReceiverContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageReceiver.propagateMessage(this.testMessage, this.testChannel);
        test.assertEqual(this.spyReceiverContext.getSpy("receiverFunction").wasNotCalled(), true,
            "Assert that the receiverFunction was NOT called");
    }
};
annotate(messageReceiverPropagateMessageReceiverOffTest).with(
    test().name("MessageReceiver propagateMessage with receiver off test")
);
