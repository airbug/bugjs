//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('bugsub.PubSub')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var PubSub                  = bugpack.require('bugsub.PubSub');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestPubSub", function(yarn) {
    yarn.spin([
        "setupTestLogger",
        "setupTestMarshaller",
        "setupTestRedisPubSub"
    ]);
    yarn.wind({
        pubSub: new PubSub(this.logger, this.marshaller, this.redisPubSub)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var pubSubInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupTestMarshaller",
            "setupTestRedisPubSub"
        ]);
        this.testPubSub     = new PubSub(this.logger, this.marshaller, this.redisPubSub);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testPubSub, PubSub),
            "Assert instance of PubSub");
        test.assertEqual(this.testPubSub.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testPubSub.getMarshaller(), this.marshaller,
            "Assert .marshaller was set correctly");
        test.assertEqual(this.testPubSub.getRedisPubSub(), this.redisPubSub,
            "Assert .redisPubSub was set correctly");
    }
};
bugmeta.tag(pubSubInstantiationTest).with(
    test().name("PubSub - instantiation test")
);
