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

//@Export('bugtask.TaskManager')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Obj')
//@Require('Tracer')
//@Require('bugtask.Task')
//@Require('bugtask.TaskDefines')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');
    var Obj                 = bugpack.require('Obj');
    var Tracer              = bugpack.require('Tracer');
    var Task                = bugpack.require('bugtask.Task');
    var TaskDefines         = bugpack.require('bugtask.TaskDefines');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series             = Flows.$series;
    var $task               = Flows.$task;
    var $traceWithError     = Tracer.$traceWithError;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @class
     * @extends {Obj}
     */
    var TaskManager = Class.extend(Obj, {

        _name: "bugtask.TaskManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {RedisClient} blockingRedisClient
         * @param {RedisClient} redisClient
         * @param {PubSub} pubSub
         * @param {Marshaller} marshaller
         * @param {string} taskQueueName
         */
        _constructor: function(logger, blockingRedisClient, redisClient, pubSub, marshaller, taskQueueName) {
            var args = ArgUtil.process(arguments, [
                {name: "logger", optional: false, type: "object"},
                {name: "blockingRedisClient", optional: false, type: "object"},
                {name: "redisClient", optional: false, type: "object"},
                {name: "pubSub", optional: false, type: "object"},
                {name: "marshaller", optional: false, type: "object"},
                {name: "taskQueueName", optional: false, type: "string"}
            ]);
            logger                  = args.logger;
            blockingRedisClient     = args.blockingRedisClient;
            redisClient             = args.redisClient;
            pubSub                  = args.pubSub;
            marshaller              = args.marshaller;
            taskQueueName           = args.taskQueueName;

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RedisClient}
             */
            this.blockingRedisClient    = blockingRedisClient;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                 = logger;

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller             = marshaller;

            /**
             * @private
             * @type {PubSub}
             */
            this.pubSub                 = pubSub;

            /**
             * @private
             * @type {RedisClient}
             */
            this.redisClient            = redisClient;

            /**
             * @private
             * @type {string}
             */
            this.taskQueueName          = taskQueueName;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {RedisClient}
         */
        getBlockingRedisClient: function() {
            return this.blockingRedisClient;
        },

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {Marshaller}
         */
        getMarshaller: function() {
            return this.marshaller;
        },

        /**
         * @return {PubSub}
         */
        getPubSub: function() {
            return this.pubSub;
        },

        /**
         * @return {RedisClient}
         */
        getRedisClient: function() {
            return this.redisClient;
        },

        /**
         * @return {string}
         */
        getTaskQueueName: function() {
            return this.taskQueueName;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getProcessingQueueName: function() {
            return "processing:" + this.getTaskQueueName();
        },

        /**
         * @return {string}
         */
        getTaskQueueMapName: function() {
            return "taskQueueMap:" + this.getTaskQueueName();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable, Task=)} callback
         */
        dequeueTask: function(callback) {
            var _this       = this;
            var taskUuid    = null;
            var task        = null;
            $series([
                $task(function(flow) {
                    _this.blockingRedisClient.bRPopLPush(_this.getTaskQueueName(), _this.getProcessingQueueName(), 15, function(error, reply) {
                        if (!error) {
                            taskUuid = reply;
                            flow.complete();
                        } else {
                            flow.error(new Exception("RedisError", {}, "An error occurred in the redis DB", [error]));
                        }
                    });
                }),
                $task(function(flow) {
                    if (taskUuid) {
                        _this.redisClient.hGet(_this.getTaskQueueMapName(), taskUuid, function(error, reply) {
                            if (!error) {
                                if (reply) {
                                    task = _this.buildTaskFromDataString(reply);
                                    flow.complete();
                                } else {
                                    flow.error(new Exception("NotFound", {}, "Could not find task with the uuid '" + taskUuid + "'"));
                                }

                            } else {
                                flow.error(new Exception("RedisError", {}, "An error occurred in the redis DB", [error]));
                            }
                        });
                    } else {
                        _this.logger.info("dequeue task timed out");
                        flow.complete();
                    }
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, task);
                } else {
                    callback(task);
                }
            });
        },

        /**
         * @param {(Task | string)} task
         * @param {function(Throwable=)} callback
         */
        finishTask: function(task, callback) {
            var _this           = this;
            var taskUuid        = task;
            if (Class.doesExtend(task, Task)) {
                taskUuid = task.getTaskUuid();
            }
            $task(function(flow) {
                var multi           = _this.redisClient.multi();
                multi
                    .lrem(_this.getProcessingQueueName(), -1, taskUuid)
                    .hdel(_this.getTaskQueueMapName(), taskUuid)
                    .exec($traceWithError(function(errors, replies) {
                        if (!errors) {
                            _this.logger.info("TASK FINISHED - taskUuid:", taskUuid);
                            flow.complete();
                        } else {
                            flow.error(new Exception("RedisError", {}, "An error occurred in the redis DB", errors));
                        }
                    }));
            }).execute(callback);
        },

        /**
         * @param {Task} task
         * @param {function(Throwable=)} callback
         */
        queueTask: function(task, callback) {
            var _this           = this;
            var taskUuid        = task.getTaskUuid();
            var taskDataString  = this.unbuildTaskToDataString(task);

            $task(function(flow) {
                var multi           = _this.redisClient.multi();
                multi
                    .lpush(_this.getTaskQueueName(), taskUuid)
                    .hset(_this.getTaskQueueMapName(), taskUuid, taskDataString)
                    .exec($traceWithError(function(errors, replies) {
                        if (!errors) {
                            _this.logger.info("TASK QUEUED - taskUuid:", task.getTaskUuid());
                            flow.complete();
                        } else {
                            flow.error(new Exception("RedisError", {}, "An error occurred in the redis DB", errors));
                        }
                    }));
            }).execute(callback);
        },

        /**
         * @param {(Task | string)} task
         * @param {function(Throwable, number=)} callback
         */
        reportTaskComplete: function(task, callback) {
            var _this           = this;
            var numberReceived  = 0;
            var taskUuid        = task;
            if (Class.doesExtend(task, Task)) {
                taskUuid = task.getTaskUuid();
            }
            $series([
                $task(function(flow) {
                    var message     = _this.pubSub.factoryMessage({
                        messageType: TaskDefines.MessageTypes.TASK_COMPLETE,
                        messageData: {
                            taskUuid: taskUuid
                        }
                    });
                    _this.pubSub.publish(_this.generateTaskResultChannel(taskUuid), message, function(throwable, reply) {
                        if (!throwable) {
                            numberReceived = reply;
                        }
                        flow.complete(throwable);
                    })
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, numberReceived);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {(Task | string)} task
         * @param {Throwable} throwable
         * @param {function(Throwable, number=)} callback
         */
        reportTaskThrowable: function(task, throwable, callback) {
            var _this           = this;
            var numberReceived  = 0;
            var taskUuid        = task;
            if (Class.doesExtend(task, Task)) {
                taskUuid = task.getTaskUuid();
            }
            $series([
                $task(function(flow) {
                    var message     = _this.pubSub.factoryMessage({
                        messageType: TaskDefines.MessageTypes.TASK_THROWABLE,
                        messageData: {
                            taskUuid: taskUuid,
                            throwable: throwable
                        }
                    });
                    _this.pubSub.publish(_this.generateTaskResultChannel(taskUuid), message, function(throwable, reply) {
                        if (!throwable) {
                            numberReceived = reply;
                        }
                        flow.complete(throwable);
                    })
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, numberReceived);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {(Task | string)} task
         * @param {function(Throwable=)} callback
         */
        requeueTask: function(task, callback) {
            var _this           = this;
            var taskUuid        = task;
            if (Class.doesExtend(task, Task)) {
                taskUuid = task.getTaskUuid();
            }
            var multi           = this.redisClient.multi();
            multi
                .lrem(this.getProcessingQueueName(), -1, taskUuid)
                .lpush(this.getTaskQueueName(), taskUuid)
                .exec($traceWithError(function(errors, replies) {
                    if (!errors) {
                        _this.logger.info("TASK REQUEUED - taskUuid:", taskUuid);
                        callback();
                    } else {
                        callback(new Exception("RedisError", {}, "An error occurred in redis", errors));
                    }
                }));
        },

        /**
         * @param {(Task | string)} task
         * @param {function(Message)} subscriberFunction
         * @param {Object} subscriberContext
         * @param {function(Throwable=)} callback
         */
        subscribeToTaskResult: function(task, subscriberFunction, subscriberContext, callback) {
            var _this           = this;
            var channel         = this.generateTaskResultChannel(task);

            $task(function(flow) {
                _this.pubSub.subscribeOnce(channel, subscriberFunction, subscriberContext, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} taskDataString
         * @return {Task}
         */
        buildTaskFromDataString: function(taskDataString) {
            return this.marshaller.unmarshalData(taskDataString);
        },

        /**
         * @private
         * @param {(Task | string)} task
         * @returns {string}
         */
        generateTaskResultChannel: function(task) {
            var taskUuid = task;
            if (Class.doesExtend(task, Task)) {
                taskUuid = task.getTaskUuid();
            }
            return "taskResult:" + taskUuid;
        },

        /**
         * @private
         * @param {Task} task
         * @return {string}
         */
        unbuildTaskToDataString: function(task) {
            return this.marshaller.marshalData(task);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugtask.TaskManager', TaskManager);
});
