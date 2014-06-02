//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('redis.RedisConfig')


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
var RedisConfig             = bugpack.require('redis.RedisConfig');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestRedisConfig", function(yarn) {
    yarn.wind({
        redisConfig: new RedisConfig({})
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var redisConfigInstantiationEmptyDataTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testConfigData             = {};
        this.testRedisConfig            = new RedisConfig(this.testConfigData);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testRedisConfig, RedisConfig),
            "Assert instance of RedisConfig");
        test.assertEqual(this.testRedisConfig.getHost(), "127.0.0.1",
            "Assert #getHost returns '127.0.0.1' by default");
        test.assertEqual(this.testRedisConfig.getPort(), 6379,
            "Assert #getPort 6379 by default");
    }
};
bugmeta.tag(redisConfigInstantiationEmptyDataTest).with(
    test().name("RedisConfig - instantiation with empty data test")
);
