//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('LiteralUtil')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var LiteralUtil     = bugpack.require('LiteralUtil');
var Set             = bugpack.require('Set');
var TypeUtil        = bugpack.require('TypeUtil');
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

var literalUtilConvertEmptySetToLiteral = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testSet            = new Set();
        this.testConvertedSet   = LiteralUtil.convertToLiteral(this.testSet);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isArray(this.testConvertedSet),
            "Assert converted Set is an array");
        test.assertEqual(this.testConvertedSet.length, 0,
            "Assert the converted Set's array is empty");
    }
};
bugmeta.annotate(literalUtilConvertEmptySetToLiteral).with(
    test().name("LiteralUtil - #convertToLiteral empty Set test")
);
