//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.DeltaDocument')
//@Require('bugdelta.SetChange')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Set                 = bugpack.require('Set');
var DeltaBuilder        = bugpack.require('bugdelta.DeltaBuilder');
var DeltaDocument       = bugpack.require('bugdelta.DeltaDocument');
var SetChange           = bugpack.require('bugdelta.SetChange');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var deltaDocumentGetPathTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test){
        this.dataObject     = {
            test: {
                propertyOne: "propertyOneValue",
                nestedTest: {propertyTwo: "propertyTwoValue"}
            }
        };
        this.deltaDocument  = new DeltaDocument(this.dataObject);
    },

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test){
        test.assertEqual(this.deltaDocument.getPath("test"), this.dataObject.test,
            "Assert deltaDocument#getPath properly returns the value of a simple path");
        test.assertEqual(this.deltaDocument.getPath("test.nestedTest"), this.dataObject.test.nestedTest,
            "Assert deltaDocument#getPath properly returns the value of a complex path");
    }
};
bugmeta.annotate(deltaDocumentGetPathTest).with(
    test().name("DeltaDocument #getPath Test")
);

/**
 *
 */
var deltaDocumentObjectChangePropertyToSameValueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.deltaDocument = new DeltaDocument({test: "value"});
        this.deltaDocument.commitDelta();
        this.deltaBuilder = new DeltaBuilder();
        this.deltaBuilder.initialize();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.deltaDocument.getData().test = "value";
        var delta = this.deltaBuilder.buildDelta(this.deltaDocument, this.deltaDocument.getPreviousDocument());
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
        this.deltaBuilder = new DeltaBuilder();
        this.deltaBuilder.initialize();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.deltaDocument.getData().test = "value";
        delete this.deltaDocument.getData().test;
        var delta = this.deltaBuilder.buildDelta(this.deltaDocument, this.deltaDocument.getPreviousDocument());
        test.assertTrue(delta.getDeltaChangeList().isEmpty(),
            "Assert that the Delta's deltaChangeList is empty after setting a value and then removing it");
    }
};
bugmeta.annotate(deltaDocumentSetPropertyRemovePropertyOnObjectNoChangeTest).with(
    test().name("DeltaDocument - set property then remove property on an object and assert no change test")
);

/**
 *
 */
var deltaDocumentSimpleSetChangeTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.deltaDocument = new DeltaDocument(new Set());
        this.deltaDocument.commitDelta();
        this.deltaBuilder = new DeltaBuilder();
        this.deltaBuilder.initialize();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.deltaDocument.getData().add("value");
        var delta = this.deltaBuilder.buildDelta(this.deltaDocument, this.deltaDocument.getPreviousDocument());
        test.assertFalse(delta.getDeltaChangeList().isEmpty(),
            "Assert that the Delta's deltaChangeList is NOT empty after adding a value to the Set");
        if (!delta.getDeltaChangeList().isEmpty()) {
            test.assertEqual(delta.getDeltaChangeList().getCount(), 1,
                "Assert change list count is 1 after adding a value to the Set");
            var change = delta.getDeltaChangeList().getAt(0);
            test.assertEqual(change.getChangeType(), SetChange.ChangeTypes.ADDED_TO_SET,
                "Assert that the change type is 'ADDED_TO_SET'");
            if (change.getChangeType() === SetChange.ChangeTypes.ADDED_TO_SET) {
                test.assertEqual(change.getSetValue(), "value",
                    "Assert setValue is 'value'");
            }
        }
    }
};
bugmeta.annotate(deltaDocumentSimpleSetChangeTest).with(
    test().name("DeltaDocument - simple Set change test")
);
