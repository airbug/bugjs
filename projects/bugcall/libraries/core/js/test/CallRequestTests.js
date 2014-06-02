//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('bugcall.CallRequest')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


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
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


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
bugmeta.tag(callRequestInstantiationTest).with(
    test().name("CallRequest - instantiation Test")
);
