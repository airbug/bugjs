//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugsub.Message')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var TypeUtil                = bugpack.require('TypeUtil');
var BugDouble               = bugpack.require('bugdouble.BugDouble');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var Message                 = bugpack.require('bugsub.Message');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var spyOnFunction           = BugDouble.spyOnFunction;
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Test Helpers
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var messageInstantiationNoArgumentsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMessage   = new Message();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMessage, Message),
            "Assert testMessage is an instance of Message");
        test.assertEqual(this.testMessage.getMessageData(), null,
            "Assert #getMessageData returns null");
        test.assertEqual(this.testMessage.getMessageType(), null,
            "Assert #getMessageType returns null");
        test.assertEqual(this.testMessage.getMessageUuid(), null,
            "Assert #getMessageUuid returns null");
    }
};
bugmeta.annotate(messageInstantiationNoArgumentsTest).with(
    test().name("Message - instantiation with no arguments Test")
);


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var messageInstantiationWithArgumentsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMessageData    = {};
        this.testMessageType    = "testMessageType";
        this.testMessage        = new Message(this.testMessageType, this.testMessageData);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessage.getMessageData(), this.testMessageData,
            "Assert #getMessageData returns testMessageData");
        test.assertEqual(this.testMessage.getMessageType(), this.testMessageType,
            "Assert #getMessageType returns testMessageType");
        test.assertEqual(this.testMessage.getMessageUuid(), null,
            "Assert #getMessageUuid returns null");
    }
};
bugmeta.annotate(messageInstantiationWithArgumentsTest).with(
    test().name("Message - instantiation with arguments Test")
);
