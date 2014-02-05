//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('bugcall.CallRequest')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil                = bugpack.require('TypeUtil');
var CallRequest             = bugpack.require('bugcall.CallRequest');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var callRequestInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testType           = "testType";
        this.testData           = "testData";
        this.testCallRequest    = new CallRequest(this.testType, this.testData);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testCallRequest.getType(), this.testType,
            "Assert #getType returns 'testType'");
        test.assertEqual(this.testCallRequest.getData(), this.testData,
            "Assert #getData returns 'testData'");
        test.assertTrue(TypeUtil.isString(this.testCallRequest.getUuid()),
            "Assert #getUuid returns a string");
    }
};
bugmeta.annotate(callRequestInstantiationTest).with(
    test().name("CallRequest - instantiation Test")
);
