/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('redis.RedisPubSub')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');
    var RedisPubSub     = bugpack.require('redis.RedisPubSub');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestRedisPubSub", function(yarn) {
        yarn.wind({
            redisClient: yarn.weave("dummyRedisClient"),
            subscriberRedisClient: yarn.weave("dummyRedisClient")
        });

        yarn.wind({
            redisPubSub: new RedisPubSub(this.redisClient, this.subscriberRedisClient)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var redisPubSubInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.wind({
                redisClient: yarn.weave("dummyRedisClient"),
                subscriberRedisClient: yarn.weave("dummyRedisClient")
            });
            this.testRedisPubSub = new RedisPubSub(this.redisClient, this.subscriberRedisClient);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testRedisPubSub, RedisPubSub),
                "Assert instance of RedisPubSub");
            test.assertEqual(this.testRedisPubSub.getRedisClient(), this.redisClient,
                "Assert .redisClient was set correctly");
            test.assertEqual(this.testRedisPubSub.getSubscriberRedisClient(), this.subscriberRedisClient,
                "Assert .subscriberRedisClient was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(redisPubSubInstantiationTest).with(
        test().name("RedisPubSub - instantiation test")
    );
});
