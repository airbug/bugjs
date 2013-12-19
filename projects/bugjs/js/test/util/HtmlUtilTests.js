//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('HtmlUtil')
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
var HtmlUtil        = bugpack.require('HtmlUtil');
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

/**
 * This tests
 * 1) Escaping html characters
 */
var htmlUtilEscapeHtmlTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testStrings = [
            {
                expected: "&lt;div&gt;&amp;&lt;/div&gt;&quot;",
                value: "<div>&</div>\""
            }
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testStrings.forEach(function(testString) {
            var result = HtmlUtil.escapeHtml(testString.value);
            test.assertEqual(result, testString.expected,
                "Assert that result escaped string is equal to the expected value");
        })
    }
};
bugmeta.annotate(htmlUtilEscapeHtmlTest).with(
    test().name("HtmlUtil - #escapeHtml test")
);
