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
//@Require('Exception')
//@Require('Flows')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('redis.DummyRedis')
//@Require('redis.RedisClient')
//@Require('redis.RedisEvent')


//-------------------------------------------------------------------------------
// Conext
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Flows                 = bugpack.require('Flows');
    var BugDouble               = bugpack.require('bugdouble.BugDouble');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag          = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');
    var DummyRedis              = bugpack.require('redis.DummyRedis');
    var RedisClient             = bugpack.require('redis.RedisClient');
    var RedisEvent              = bugpack.require('redis.RedisEvent');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var spyOnFunction           = BugDouble.spyOnFunction;
    var test                    = TestTag.test;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------


    bugyarn.registerWeaver("dummyRedisClient", function(yarn) {
        yarn.spin([
            "setupTestRedisConfig",
            "setupDummyRedis"
        ]);
        return new RedisClient(this.redis, this.redisConfig);
    });

    bugyarn.registerWinder("setupDummyRedis", function(yarn) {
        yarn.wind({
            redis: new DummyRedis()
        });
    });

    bugyarn.registerWinder("setupDummyRedisClient", function(yarn) {
        yarn.spin([
            "setupTestRedisConfig",
            "setupDummyRedis"
        ]);
        yarn.wind({
            redisClient: new RedisClient(this.redis, this.redisConfig)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var redisClientInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestRedisConfig"
            ]);
            this.testDummyRedis = {};
            this.testRedisClient = new RedisClient(this.testDummyRedis, this.redisConfig);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testRedisClient, RedisClient),
                "Assert instance of RedisClient");
            test.assertEqual(this.testRedisClient.getClient(), null,
                "Assert #getClient returns null by default");
            test.assertEqual(this.testRedisClient.getConfig(), this.redisConfig,
                "Assert .config was set correctly");
            test.assertEqual(this.testRedisClient.getConnected(), false,
                "Assert #getConnected false by default");
            test.assertEqual(this.testRedisClient.getConnecting(), false,
                "Assert #getConnecting false by default");
            test.assertEqual(this.testRedisClient.getRedis(), this.testDummyRedis,
                "Assert .redis was set correctly");
        }
    };

    var redisClientConnectTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupDummyRedisClient"
            ]);
            test.completeSetup();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.redisClient.connect(function(throwable) {
                        if (!throwable) {
                            test.assertTrue(_this.redisClient.getConnected(),
                                "Assert RedisClient is connected");
                            test.assertFalse(_this.redisClient.getConnecting(),
                                "Assert RedisClient is no longer connecting");
                            test.assertTrue(!!_this.redisClient.getClient(),
                                "Assert client was created");
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };

    var redisClientSubscribeTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupDummyRedisClient"
            ]);
            this.callbackFired      = false;
            this.testChannel        = "testChannel";
            this.redisClient.addEventListener(RedisEvent.EventTypes.SUBSCRIBE, function(event) {
                var data = event.getData();
                test.assertEqual(data.channel, _this.testChannel,
                    "Assert event.data.channel was set to testChannel");
                test.assertEqual(data.count, 1,
                    "Assert event.data.count is 1");
                if (_this.callbackFired) {
                    test.completeTest();
                } else {
                    test.error(new Exception("WrongOrder", {}, "Event listener fired before callback. Callback should always fire before listener."))
                }
            });
            $series([
                $task(function(flow) {
                    _this.redisClient.connect(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.redisClient.subscribe(_this.testChannel, function(throwable, subscribedChannel) {
                        if (!throwable) {
                            _this.callbackFired = true;
                            test.assertEqual(subscribedChannel, _this.testChannel,
                                "Assert channel in callback is equal to testChannel");
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (throwable) {
                    test.error(throwable);
                }
            });
        }
    };

    var redisClientPublishTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupDummyRedisClient"
            ]);
            this.testChannel        = "testChannel";
            this.testMessage        = "testMessage";
            this.redisClient.addEventListener(RedisEvent.EventTypes.MESSAGE, function(event) {
                test.assertTrue(false,
                    "Listener should not fire");
            });
            $series([
                $task(function(flow) {
                    _this.redisClient.connect(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.redisClient.publish(_this.testChannel, _this.testMessage, function(throwable, count) {
                        if (!throwable) {
                            test.assertEqual(count, 0,
                                "Assert receiver count is 0");
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };

    var redisClientPublishWithSubscriberTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                       = this;
            var yarn                        = bugyarn.yarn(this);
            this.testPublishRedisClient     = yarn.weave("dummyRedisClient");
            this.testSubscribeRedisClient   = yarn.weave("dummyRedisClient");
            this.testChannel                = "testChannel";
            this.testMessage                = "testMessage";
            this.testSubscribeRedisClient.addEventListener(RedisEvent.EventTypes.MESSAGE, function(event) {
                test.assertEqual(event.getData().message, _this.testMessage,
                    "Assert event.data.message was set correctly");
                test.assertEqual(event.getData().channel, _this.testChannel,
                    "Assert event.data.channel was set correctly");
                test.completeTest();
            });
            $series([
                $task(function(flow) {
                    _this.testSubscribeRedisClient.connect(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.testPublishRedisClient.connect(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.testSubscribeRedisClient.subscribe(_this.testChannel, function(throwable, subscribedChannel) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.testPublishRedisClient.publish(_this.testChannel, _this.testMessage, function(throwable, count) {
                        if (!throwable) {
                            test.assertEqual(count, 1,
                                "Assert receiver count is 1");
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (throwable) {
                    test.error(throwable);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(redisClientInstantiationTest).with(
        test().name("RedisClient - instantiation test")
    );

    bugmeta.tag(redisClientConnectTest).with(
        test().name("RedisClient - #connect test")
    );

    bugmeta.tag(redisClientSubscribeTest).with(
        test().name("RedisClient - #subscribe test")
    );

    bugmeta.tag(redisClientPublishTest).with(
        test().name("RedisClient - #publish test")
    );

    bugmeta.tag(redisClientPublishWithSubscriberTest).with(
        test().name("RedisClient - #publish with subscriber test")
    );
});
