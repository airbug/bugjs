//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Document')
//@Require('IDocument')
//@Require('Obj')
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
var Document        = bugpack.require('Document');
var IDocument       = bugpack.require('IDocument');
var Obj             = bugpack.require('Obj');
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

var documentInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.document, Document),
            "Assert instance of Document");
        test.assertTrue(Class.doesImplement(this.document, IDocument),
            "Assert implements IDocument");
        test.assertEqual(this.document.getData(), undefined,
            "Assert data is undefined");
    }
};
bugmeta.annotate(documentInstantiationTest).with(
    test().name("Document - instantiation test")
);

var documentInstantiationWithParamsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testData = "abc123";
        this.document = new Document(this.testData);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.document.getData(), this.testData,
            "Assert data is testData");
    }
};
bugmeta.annotate(documentInstantiationWithParamsTest).with(
    test().name("Document - instantiation with params test")
);

var documentGetPathNoStringThrowsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertThrows(function() {
            this.getPath(1);
        }, "Assert getPath with a number throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath(null);
        }, "Assert getPath with a null throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath(undefined);
        }, "Assert getPath with undefined string throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath({});
        }, "Assert getPath with Object throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath([]);
        }, "Assert getPath with Array throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath(false);
        }, "Assert getPath with boolean throws ArgumentBug");
    }
};
bugmeta.annotate(documentGetPathNoStringThrowsTest).with(
    test().name("Document - getPath with non string test")
);

var documentGetPathNullDocTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.document.getPath(""), undefined,
            "Assert blank path path is undefined");
        test.assertEqual(this.document.getPath("abc"), undefined,
            "Assert single path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf"), undefined,
            "Assert double path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf.ghi"), undefined,
            "Assert triple path path is undefined");
    }
};
bugmeta.annotate(documentGetPathNullDocTest).with(
    test().name("Document - #getPath with null doc test")
);

var documentGetPathSimpleTestTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPath  = "testPath";
        this.testValue = "abc123";
        this.testData = {
            testPath: this.testValue
        };
        this.document = new Document(this.testData);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.document.getPath(""), this.testData,
            "Assert blank path path is testData");
        test.assertEqual(this.document.getPath(this.testPath), this.testValue,
            "Assert testPath is testValue")
        test.assertEqual(this.document.getPath("abc"), undefined,
            "Assert single path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf"), undefined,
            "Assert double path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf.ghi"), undefined,
            "Assert triple path path is undefined");
    }
};
bugmeta.annotate(documentGetPathSimpleTestTest).with(
    test().name("Document - #getPath simple test")
);