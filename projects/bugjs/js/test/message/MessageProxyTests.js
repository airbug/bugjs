//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
//@Require('MessageDefines')
//@Require('MessageProxy')
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
var MessageProxy    = bugpack.require('MessageProxy');
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
 * 1) Instantiation of a MessageProxy
 * 2) That the address and messageREceiver values are set correctly during instantiation
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
        test.assertEqual(this.testMessageProxy.getMessageReceiver(), null,
            "Assert messageReceiver was set to null during instantiation");
        test.assertTrue(TypeUtil.isString(this.testMessageProxy.getAddress()),
            "Assert address was set to a string during instantiation");
    }
};
annotate(instantiateMessageProxyTest).with(
    test().name("MessageProxy instantiation test")
);


/**
 * This tests
 * 1) That the receiveMessage function correctly sends a message to the proxied MessageReceiver
 */
var messageProxySendMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.receiveMessageCalled = false;
        this.testChannel = MessageDefines.MessageChannels.MESSAGE;
        this.testMessage = new Message();
        this.dummyProxiedMessageReceiver = {
            receiveMessage: function(message, channel) {
                _this.receiveMessageCalled = true;
                test.assertEqual(message, _this.testMessage,
                    "Assert message received by dummy was testMessage");
                test.assertEqual(channel, _this.testChannel,
                    "Assert default message channel is MESSAGE");
            }
        };
        this.testMessageProxy = new MessageProxy();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMessageProxy.setMessageReceiver(this.dummyProxiedMessageReceiver);
        this.testMessageProxy.receiveMessage(this.testMessage, this.testChannel);
        test.assertEqual(this.receiveMessageCalled, true,
            "Assert that the receiveMessage function of the dummy was called");
    }
};
annotate(messageProxySendMessageTest).with(
    test().name("MessageProxy sendMessage test")
);
