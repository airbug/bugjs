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


/**
 * This tests
 * 1) Escaping html characters
 */
var htmlUtilReplaceUrlsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testStrings = [
            {
                expected: "<b>http://localhost</b>",
                value: "http://localhost"
            },
            {
                expected: "test <b>http://localhost</b> test",
                value: "test http://localhost test"
            },
            {
                expected: "<b>www.airbug.com</b>",
                value: "www.airbug.com"
            },
            {
                expected: "<b>www.airbug.com:80</b>",
                value: "www.airbug.com:80"
            },
            {
                expected: "<b>http://localhost:8000/app#room/52d997cf05830c97a6a5da50</b>",
                value: "http://localhost:8000/app#room/52d997cf05830c97a6a5da50"
            },
            {
                expected: "<b>http://localhost</b>:/app#room/52d997cf05830c97a6a5da50",
                value: "http://localhost:/app#room/52d997cf05830c97a6a5da50"
            }
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testStrings.forEach(function(testString) {
            var result = HtmlUtil.replaceUrls(testString.value, function(match) {
                return "<b>" + match + "</b>";
            });
            test.assertEqual(result, testString.expected,
                "Assert that result replaced url is equal to the expected value");
        })
    }
};
bugmeta.annotate(htmlUtilReplaceUrlsTest).with(
    test().name("HtmlUtil - #replaceUrls test")
);
