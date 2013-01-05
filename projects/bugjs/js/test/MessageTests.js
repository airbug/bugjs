//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('../../lib/Annotate');
var Message = require('../../lib/Message');
var TestAnnotation = require('../../lib/unit/TestAnnotation');


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
 * 2) That the topic and data values were set correctly during instantiation
 */
var instantiateMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testTopic = "testTopic";
        this.testData = "testData";
        this.message = new Message(this.testTopic, this.testData);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.message.getTopic(), this.testTopic,
            "Assert message topic was set correctly during instantiation");
        test.assertEqual(this.message.getData(), this.testData,
            "Assert message data was set correctly during instantiation");
    }
};
annotate(instantiateMessageTest).with(
    test().name("Message instantiation test")
);
