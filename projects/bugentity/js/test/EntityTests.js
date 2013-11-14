//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('bugentity.Entity')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


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
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


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

var entitySetIdTest = {

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
bugmeta.annotate(entitySetIdTest).with(
    test().name("Entity - #setId Test")
);


var entityGetIdTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testObjectId = {
            toString: function() {
                return _this.testId;
            }
        };
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
        this.testEntity.setId(this.testObjectId);

        var returnedId = this.testEntity.getId();
        test.assertTrue(TypeUtil.isString(returnedId),
            "Assert id was returned as a String type");
        test.assertEqual(returnedId, this.testId,
            "Assert the correct id was returned");
    }
};
bugmeta.annotate(entityGetIdTest).with(
    test().name("Entity - #getId Test")
);
