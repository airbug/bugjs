//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugcall.CallRequestManager')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CallRequestManager      = bugpack.require('bugcall.CallRequestManager');
var BugDouble               = bugpack.require('bugdouble.BugDouble');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var Logger                  = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var spyOnObject             = BugDouble.spyOnObject;
var stubObject              = BugDouble.stubObject;
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestCallRequestManager", function(yarn) {
    yarn.spin([
        "setupDummyRedisClient",
        "setupTestCallRequestFactory"
    ]);
    yarn.wind({
        callRequestManager: new CallRequestManager(this.redisClient, this.callRequestFactory)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var callRequestManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupDummyRedisClient",
            "setupTestCallRequestFactory"
        ]);
        this.testCallRequestManager = new CallRequestManager(this.redisClient, this.callRequestFactory);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCallRequestManager, CallRequestManager),
            "Assert instance of CallRequestManager");
        test.assertEqual(this.testCallRequestManager.getCallRequestFactory(), this.callRequestFactory,
            "Assert .callRequestFactory was set correctly");
        test.assertEqual(this.testCallRequestManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
    }
};
bugmeta.annotate(callRequestManagerInstantiationTest).with(
    test().name("CallRequestManager - instantiation Test")
);
