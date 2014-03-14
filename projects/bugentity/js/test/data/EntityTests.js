//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('bugentity.Entity')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil                = bugpack.require('TypeUtil');
var Entity                  = bugpack.require('bugentity.Entity');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var entityInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testId         = "testId";
        this.testCreatedAt  = new Date();
        this.testUpdatedAt  = new Date();
        this.testEntity = new Entity({
            id: this.testId,
            createdAt: this.testCreatedAt,
            updatedAt: this.testUpdatedAt
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testEntity.getId(), this.testId,
            "Assert Entity.id was set correctly");
        test.assertEqual(this.testEntity.getCreatedAt(), this.testCreatedAt,
            "Assert Entity.createdAt was set correctly");
        test.assertEqual(this.testEntity.getUpdatedAt(), this.testUpdatedAt,
            "Assert Entity.createdAt was set correctly");
    }
};
bugmeta.annotate(entityInstantiationTest).with(
    test().name("Entity - instantiation Test")
);

var entityGetIdAndSetIdTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testId     = "testId";
        this.testEntity = new Entity();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertEqual(this.testEntity.getId(), undefined,
            "Assert Entity.id is not set");
        this.testEntity.setId(this.testId);
        test.assertEqual(this.testEntity.getId(), this.testId,
            "Assert Entity.id id was set correctly using setId");
        test.assertThrows(function() {
            _this.testEntity.setId("someOtherId");
        }, "Assert Entity.id cannot be set twice");
    }
};
bugmeta.annotate(entityGetIdAndSetIdTest).with(
    test().name("Entity - #getId and #setId Test")
);

var entityGetCreatedAtAndSetCreatedAtTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCreatedAt      = new Date();
        this.testEntity         = new Entity();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testEntity.getCreatedAt(), undefined,
            "Assert Entity.createdAt is not set");
        this.testEntity.setCreatedAt(this.testCreatedAt);
        test.assertEqual(this.testEntity.getCreatedAt(), this.testCreatedAt,
            "Assert Entity.createdAt was set correctly using setCreatedAt");
    }
};
bugmeta.annotate(entityGetCreatedAtAndSetCreatedAtTest).with(
    test().name("Entity - #getCreatedAt and #setCreatedAt Test")
);

var entityGetUpdatedAtAndSetUpdatedAtTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testUpdatedAt      = new Date();
        this.testEntity         = new Entity();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testEntity.getUpdatedAt(), undefined,
            "Assert Entity.updatedAt is not set");
        this.testEntity.setUpdatedAt(this.testUpdatedAt);
        test.assertEqual(this.testEntity.getUpdatedAt(), this.testUpdatedAt,
            "Assert Entity.updatedAt was set correctly using setUpdatedAt");
    }
};
bugmeta.annotate(entityGetUpdatedAtAndSetUpdatedAtTest).with(
    test().name("Entity - #getUpdatedAt and #setUpdatedAt Test")
);
