//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Message')
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
 * 1) Instantiation of a Message
 * 2) That the type and data values were set correctly during instantiation
 */
var instantiateMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testTopic = "testTopic";
        this.testData = {};
        this.testMessage = new Message(this.testTopic, this.testData);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMessage.getTopic(), this.testTopic,
            "Assert 'topic' was set correctly during instantiation");
        test.assertEqual(this.testMessage.getData(), this.testData,
            "Assert 'data' was set correctly during instantiation");

        test.assertNotEqual(this.testMessage.getTopic(), "sdfdsf",
            "Assert 'topic' does not equal any old string");
        test.assertNotEqual(this.testMessage.getData(), {},
            "Assert 'data' does not equal any old object");
    }
};
annotate(instantiateMessageTest).with(
    test().name("Message instantiation test")
);
