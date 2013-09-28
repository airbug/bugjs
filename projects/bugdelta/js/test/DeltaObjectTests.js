//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.DeltaObject')
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
var DeltaObject         = bugpack.require('bugdelta.DeltaObject');
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
var deltaObjectSetPropertyToSameValueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.deltaObject = new DeltaObject();
        this.deltaObject.setProperty("test", "value");
        this.deltaObject.commitChanges();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.deltaObject.setProperty("test", "value");
        test.assertTrue(this.deltaObject.getPropertyChangeMap().isEmpty(),
            "Assert that the DeltaObject's propertyChangeMap is empty after setting the same value on the same property");
    }
};
bugmeta.annotate(deltaObjectSetPropertyToSameValueTest).with(
    test().name("DeltaObject - setProperty to same value test")
);

/**
 *
 */
var deltaObjectSetPropertyRemovePropertyNoChangeTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.deltaObject = new DeltaObject();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.deltaObject.setProperty("test", "value");
        this.deltaObject.removeProperty("test");
        test.assertTrue(this.deltaObject.getPropertyChangeMap().isEmpty(),
            "Assert that the DeltaObject's propertyChangeMap is empty after setting a value and then removing it");
        test.assertTrue(this.deltaObject.getPropertyMap().isEmpty(),
            "Assert that the DeltaObject's propertyMap is empty after setting a value and then removing it");
    }
};
bugmeta.annotate(deltaObjectSetPropertyRemovePropertyNoChangeTest).with(
    test().name("DeltaObject - setProperty then removeProperty and assert no change test")
);
