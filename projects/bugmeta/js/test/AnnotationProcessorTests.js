//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.AnnotationProcessor')
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
var BugDouble               = bugpack.require('bugdouble.BugDouble');
var AnnotationProcessor     = bugpack.require('bugmeta.AnnotationProcessor');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var spyOnFunction           = BugDouble.spyOnFunction;
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var annotationProcessorInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testProcessorFunction      = function(annotation) {};
        this.testAnnotationProcessor    = new AnnotationProcessor(this.testProcessorFunction);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testAnnotationProcessor.getProcessorFunction(), this.testProcessorFunction,
            "Assert #getProcessorFunction returns testProcessorFunction");
    }
};
bugmeta.annotate(annotationProcessorInstantiationTest).with(
    test().name("AnnotationProcessor - instantiation Test")
);


var annotationProcessorInstantiationMissingProcessorFunctionTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {

    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertThrows(function() {
            var annotationProcessor = new AnnotationProcessor();
        }, "Assert instantiating an AnnotationProcessor without processorFunction parameter throws an Error");
    }
};
bugmeta.annotate(annotationProcessorInstantiationMissingProcessorFunctionTest).with(
    test().name("AnnotationProcessor - instantiation missing processorFunction Test")
);


var annotationProcessorProcessAnnotationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                       = this;
        this.testAnnotation             = {};
        this.testProcessorFunction      = function(annotation) {
            test.assertEqual(annotation, _this.testAnnotation,
                "Assert annotation received in processorFunction is testAnnotation");
        };
        this.testProcessorFunctionSpy   = spyOnFunction(this.testProcessorFunction);
        this.testAnnotationProcessor    = new AnnotationProcessor(this.testProcessorFunctionSpy);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testAnnotationProcessor.processAnnotation(this.testAnnotation);
        test.assertTrue(this.testProcessorFunctionSpy.wasCalled(),
            "Assert processorFunction was called");
    }
};
bugmeta.annotate(annotationProcessorProcessAnnotationTest).with(
    test().name("AnnotationProcessor - #processAnnotation Test")
);
