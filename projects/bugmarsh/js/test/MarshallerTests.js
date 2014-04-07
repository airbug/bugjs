//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmarsh.Marshaller')
//@Require('bugmeta.Annotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.MetaContext')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Marshaller              = bugpack.require('bugmarsh.Marshaller');
var Annotation              = bugpack.require('bugmeta.Annotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var MetaContext             = bugpack.require('bugmeta.MetaContext');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMarshaller", function(yarn) {
    yarn.spin([
        "setupTestMarshRegistry"
    ]);
    yarn.wind({
        marshaller: new Marshaller(this.marshRegistry)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var marshallerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin(["setupTestMarshRegistry"]);
        this.testMarshaller     = new Marshaller(this.marshRegistry);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMarshaller, Marshaller),
            "Assert testMarshaller is an instance of Marshaller");
        test.assertEqual(this.testMarshaller.getMarshRegistry(), this.marshRegistry,
            "Assert marshRegistry was set correctly");
    }
};
bugmeta.annotate(marshallerInstantiationTest).with(
    test().name("Marshaller - instantiation test")
);
