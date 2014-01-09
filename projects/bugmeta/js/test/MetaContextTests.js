//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugmeta.Annotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.MetaContext')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var TypeUtil                = bugpack.require('TypeUtil');
var Annotation              = bugpack.require('bugmeta.Annotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var MetaContext             = bugpack.require('bugmeta.MetaContext');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var metaContextInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMetaContext = new MetaContext();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMetaContext, MetaContext),
            "Assert that testMetaContext is an instance of MetaContext");
        test.assertTrue(this.testMetaContext.getAnnotationMap().isEmpty(),
            "Assert annotationMap starts empty");
        test.assertTrue(this.testMetaContext.getAnnotationProcessorMap().isEmpty(),
            "Assert annotationProcessorMap starts empty");
        test.assertTrue(this.testMetaContext.getReferenceToAnnotationListMap().isEmpty(),
            "Assert referenceToAnnotationListMap starts empty");
    }
};
bugmeta.annotate(metaContextInstantiationTest).with(
    test().name("MetaContext - instantiation Test")
);


var metaContextAddAnnotationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testAnnotationType         = "testAnnotationType";
        this.testAnnotationReference    = Class.declare({});
        this.testAnnotation             = new Annotation(this.testAnnotationType);
        this.testAnnotation.setAnnotationReference(this.testAnnotationReference);
        this.testMetaContext            = new MetaContext();
        this.testMetaContext.addAnnotation(this.testAnnotation);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var annotationsByTypeList = this.testMetaContext.getAnnotationsByType(this.testAnnotationType);
        test.assertTrue(annotationsByTypeList.contains(this.testAnnotation),
            "Assert that annotationsTypeList returned the annotation")
        var annotationsByReferenceList = this.testMetaContext.getAnnotationsByReference(this.testAnnotationReference);
        test.assertTrue(annotationsByReferenceList.contains(this.testAnnotation),
            "Assert that annotationsByReferenceList returned the annotation")
    }
};
bugmeta.annotate(metaContextAddAnnotationTest).with(
    test().name("MetaContext - #addAnnotation Test")
);
