//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugentity.EntitySchema')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EntitySchema            = bugpack.require('bugentity.EntitySchema');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
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

bugyarn.registerWeaver("testEntitySchema", function(yarn, args) {
    return new EntitySchema(args[0], args[1], args[2]);
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var entitySchemaInstantiationNoOptionsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testEntityClass        = function() {};
        this.testEntityName         = "testEntityName";
        this.testEntitySchema       = new EntitySchema(this.testEntityClass, this.testEntityName);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testEntitySchema, EntitySchema),
            "Assert instance of EntitySchema");
        test.assertEqual(this.testEntitySchema.getEntityClass(), this.testEntityClass,
            "Assert .entityClass was set correctly");
        test.assertEqual(this.testEntitySchema.getEntityName(), this.testEntityName,
            "Assert .entityName was set correctly");
        test.assertEqual(this.testEntitySchema.getEntityStored(), true,
            "Assert .entityStore defaults to true");
        test.assertEqual(this.testEntitySchema.getEntityEmbedded(), false,
            "Assert .entityEmbedded defaults to false");
    }
};

var entitySchemaInstantiationWithOptionsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testEntityClass        = function() {};
        this.testEntityName         = "testEntityName";
        this.testEntityOptions      = {
            embedded: true,
            stored: false
        };
        this.testEntitySchema       = new EntitySchema(this.testEntityClass, this.testEntityName, this.testEntityOptions);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testEntitySchema, EntitySchema),
            "Assert instance of EntitySchema");
        test.assertEqual(this.testEntitySchema.getEntityClass(), this.testEntityClass,
            "Assert .entityClass was set correctly");
        test.assertEqual(this.testEntitySchema.getEntityName(), this.testEntityName,
            "Assert .entityName was set correctly");
        test.assertEqual(this.testEntitySchema.getEntityStored(), false,
            "Assert .entityStored was set correctly");
        test.assertEqual(this.testEntitySchema.getEntityEmbedded(), true,
            "Assert .entityEmbedded was set correctly");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(entitySchemaInstantiationNoOptionsTest).with(
    test().name("EntitySchema - instantiation with no options test")
);

bugmeta.annotate(entitySchemaInstantiationWithOptionsTest).with(
    test().name("EntitySchema - instantiation with options test")
);
