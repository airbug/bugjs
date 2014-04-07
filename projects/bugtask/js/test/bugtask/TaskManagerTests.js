//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskManager')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TaskManager             = bugpack.require('bugtask.TaskManager');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestTaskManager", function(yarn) {
    yarn.spin([
        "setupTestLogger",
        "setupDummyRedisClient",
        "setupTestPubSub",
        "setupTestMarshaller"
    ]);
    yarn.wind({
        blockingRedisClient: yarn.weave("dummyRedisClient")
    });
    var testTaskQueueName = "testTaskQueueName";
    yarn.wind({
        taskManager: new TaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, testTaskQueueName)
    });
});


//-------------------------------------------------------------------------------
// Setup Methods
//-------------------------------------------------------------------------------

var setupTaskManager = function(yarn, setupObject, callback) {
    setupObject.marshRegistry.processModule();
    $series([
        $task(function(flow) {
            setupObject.blockingRedisClient.connect(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.redisClient.connect(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.subscriberRedisClient.connect(function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var taskManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupDummyRedisClient",
            "setupTestPubSub",
            "setupTestMarshaller"
        ]);
        yarn.wind({
            blockingRedisClient: yarn.weave("dummyRedisClient")
        });
        this.testTaskQueueName  = "testTaskQueueName";
        this.testTaskManager    = new TaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, this.testTaskQueueName);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testTaskManager, TaskManager),
            "Assert instance of TaskManager");
        test.assertEqual(this.testTaskManager.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testTaskManager.getMarshaller(), this.marshaller,
            "Assert .marshaller was set correctly");
        test.assertEqual(this.testTaskManager.getBlockingRedisClient(), this.blockingRedisClient,
            "Assert .blockingRedisClient was set correctly");
        test.assertEqual(this.testTaskManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
        test.assertEqual(this.testTaskManager.getPubSub(), this.pubSub,
            "Assert .pubSub was set correctly");
        test.assertEqual(this.testTaskManager.getTaskQueueName(), this.testTaskQueueName,
            "Assert .taskQueueName was set correctly");
    }
};

var taskManagerSubscribeToTaskResultTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestTaskManager"
        ]);
        this.testTaskUuid   = "testTaskUuid";
        this.testTask       = yarn.weave("testTask", [this.testTaskUuid]);

        $task(function(flow) {
            setupTaskManager(yarn, _this, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
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
        var taskResultChannel   = this.taskManager.generateTaskResultChannel(this.testTask);
        this.taskManager.subscribeToTaskResult(this.testTask, function() {}, null, function(throwable) {
            if (!throwable) {
                test.assertTrue(_this.taskManager.getPubSub().hasSubscriber(taskResultChannel),
                    "Assert subscriber has been added for result channel");
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};


var taskManagerQueueTaskTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestTaskManager"
        ]);
        this.testTaskUuid   = "testTaskUuid";
        this.testTask       = yarn.weave("testTask", [this.testTaskUuid]);
        $task(function(flow) {
            setupTaskManager(yarn, _this, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
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
        var _this               = this;
        this.taskManager.queueTask(this.testTask, function(throwable) {
            if (!throwable) {
                var taskQueueName = _this.taskManager.getTaskQueueName();
                var redisList       = _this.redis.getKeyToEntryMap().get(taskQueueName);
                test.assertTrue(redisList.contains(_this.testTask.getTaskUuid()),
                    "Assert Redis contains a List that has the task uuid");
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(taskManagerInstantiationTest).with(
    test().name("TaskManager - instantiation test")
);
bugmeta.annotate(taskManagerSubscribeToTaskResultTest).with(
    test().name("TaskManager - #subscribeToTaskResult test")
);
bugmeta.annotate(taskManagerQueueTaskTest).with(
    test().name("TaskManager - #queueTask test")
);