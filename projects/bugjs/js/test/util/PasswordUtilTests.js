//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('PasswordUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var PasswordUtil    = bugpack.require('PasswordUtil');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var PasswordUtilIsValidTest = {

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(PasswordUtil.isValid("happy!"),
            "Ensure that a valid password is valid");
        test.assertFalse(PasswordUtil.isValid(undefined),
            "Ensure that undefined passwords are not valid");
        test.assertFalse(PasswordUtil.isValid(null),
            "Ensure that null passwords are not valid");
        test.assertFalse(PasswordUtil.isValid(""),
            "Ensure that empty passwords are not valid");
    }
};
bugmeta.annotate(PasswordUtilIsValidTest).with(
    test().name("PasswordUtil #isValid tests")
);
