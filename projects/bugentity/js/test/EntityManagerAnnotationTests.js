//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit-annotate.TestAnnotation');


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
var entityManagerAnnotationInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.entityManagerAnnotation = EntityManagerAnnotation.entityManager("moduleName");
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.entityManagerAnnotation.getModuleName(), "moduleName",
            "Assert moduleName was successfully set");
        test.assertEqual(this.entityManagerAnnotation.getAnnotationType(), "EntityManager",
            "Assert annotationType was successfully set");
    }
};
bugmeta.annotate(entityManagerAnnotationInstantiationTest).with(
    test().name("EntityManagerAnnotation - instantiation test")
);
