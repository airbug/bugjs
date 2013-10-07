//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.DeltaDocument')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var DeltaDocument       = bugpack.require('bugdelta.DeltaDocument');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var deltaDocumentObjectChangePropertyToSameValueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.deltaDocument = new DeltaDocument({test: "value"});
        this.deltaDocument.commitDelta();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.deltaDocument.getData().test = "value";
        var delta = this.deltaDocument.generateDelta();
        test.assertTrue(delta.getDeltaChangeList().isEmpty(),
            "Assert that the Delta's deltaChangeList is empty after setting the same value on the same property in an object");
    }
};
bugmeta.annotate(deltaDocumentObjectChangePropertyToSameValueTest).with(
    test().name("DeltaDocument - set property of object to same value test")
);

/**
 *
 */
var deltaDocumentSetPropertyRemovePropertyOnObjectNoChangeTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.deltaDocument = new DeltaDocument({});
        this.deltaDocument.commitDelta();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.deltaDocument.getData().test = "value";
        delete this.deltaDocument.getData().test;
        var delta = this.deltaDocument.generateDelta();
        test.assertTrue(delta.getDeltaChangeList().isEmpty(),
            "Assert that the Delta's deltaChangeList is empty after setting a value and then removing it");
    }
};
bugmeta.annotate(deltaDocumentSetPropertyRemovePropertyOnObjectNoChangeTest).with(
    test().name("DeltaDocument - set property then remove property on an object and assert no change test")
);
