//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
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

var bugMetaContextTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMetaContext = BugMeta.context();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMetaContext, MetaContext),
            "Assert BugMeta#context returns a MetaContext");
    }
};
bugmeta.annotate(bugMetaContextTest).with(
    test().name("BugMeta - #context Test")
);
