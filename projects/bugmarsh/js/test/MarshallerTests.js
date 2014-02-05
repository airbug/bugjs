//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmarsh.Marshaller')
//@Require('bugmarsh.MarshRegistry')
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
var Marshaller              = bugpack.require('bugmarsh.Marshaller');
var MarshRegistry           = bugpack.require('bugmarsh.MarshRegistry');
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

var marshallerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMarshRegistry  = new MarshRegistry();
        this.testMarshaller     = new Marshaller(this.testMarshRegistry);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMarshaller, Marshaller),
            "Assert testMarshaller is an instance of Marshaller");
        test.assertEqual(this.testMarshaller.getMarshRegistry(), this.testMarshRegistry,
            "Assert marshRegistry was set correctly");
    }
};
bugmeta.annotate(marshallerInstantiationTest).with(
    test().name("Marshaller - instantiation test")
);
