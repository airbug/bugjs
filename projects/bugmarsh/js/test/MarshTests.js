//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmarsh.Marsh')
//@Require('bugmarsh.MarshProperty')
//@Require('bugmeta.Annotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmeta.MetaContext')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Marsh                   = bugpack.require('bugmarsh.Marsh');
var MarshProperty           = bugpack.require('bugmarsh.MarshProperty');
var Annotation              = bugpack.require('bugmeta.Annotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var MetaContext             = bugpack.require('bugmeta.MetaContext');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var marshInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMarshClass     = function() {};
        this.testMarshName      = "testMarshName";
        this.testMarsh          = new Marsh(this.testMarshClass, this.testMarshName);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMarsh, Marsh),
            "Assert testMarsh is an instance of Marsh");
        test.assertEqual(this.testMarsh.getMarshClass(), this.testMarshClass,
            "Assert marshClass was set correctly");
        test.assertEqual(this.testMarsh.getMarshName(), this.testMarshName,
            "Assert marshName was set correctly");
        test.assertTrue(this.testMarsh.getMarshPropertyList().isEmpty(),
            "Assert that marshPropertyList is empty");
    }
};
bugmeta.annotate(marshInstantiationTest).with(
    test().name("Marsh - instantiation test")
);


var marshAddPropertyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMarshClass     = function() {};
        this.testMarshName      = "testMarshName";
        this.testMarsh          = new Marsh(this.testMarshClass, this.testMarshName);
        this.testPropertyName   = "testPropertyName";
        this.testMarshProperty  = new MarshProperty(this.testPropertyName);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMarsh.addProperty(this.testMarshProperty);
        test.assertTrue(this.testMarsh.hasPropertyByName(this.testMarshProperty.getPropertyName()),
            "Assert that testMarsh now has the property");
        test.assertEqual(this.testMarsh.getPropertyByName(this.testPropertyName), this.testMarshProperty,
            "Assert that testMarsh#getPropertyByName returns the testProperty");
    }
};
bugmeta.annotate(marshAddPropertyTest).with(
    test().name("Marsh - #addProperty test")
);
