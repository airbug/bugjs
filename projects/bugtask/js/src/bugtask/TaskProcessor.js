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

//@Export('bugtask.TaskProcessor')

//@Require('Bug')
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Flows')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @class
     * @extends {EventDispatcher}
     */
    var TaskProcessor = Class.extend(EventDispatcher, {

        _name: "bugtask.TaskProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {TaskManager} taskManager
         */
        _constructor: function(taskManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {TaskProcessor.States}
             */
            this.state          = TaskProcessor.States.STOPPED;

            /**
             * @private
             * @type {TaskManager}
             */
            this.taskManager    = taskManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {TaskProcessor.States}
         */
        getState: function() {
            return this.state;
        },

        /**
         * @return {TaskManager}
         */
        getTaskManager: function() {
            return this.taskManager;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isStarted: function() {
            return this.state === TaskProcessor.States.STARTED;
        },

        /**
         * @return {boolean}
         */
        isStopped: function() {
            return this.state === TaskProcessor.States.STOPPED;
        },

        /**
         * @return {boolean}
         */
        isStopping: function() {
            return this.state === TaskProcessor.States.STOPPING;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        start: function() {
            if (this.isStopped()) {
                this.startProcessingTasks();
            } else {
                throw new Bug("IllegalState", {}, "Processor already started or is stopping");
            }
        },

        /**
         *
         */
        stop: function() {
            if (this.isStarted()) {
                this.stopProcessingTasks();
            } else {
                throw new Bug("IllegalState", {}, "Processor already stopped or is stopping");
            }
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Task} task
         * @param {function(Throwable=)} callback
         */
        doTask: function(task, callback) {
            throw new Bug("AbstractMethodNotImplemented", {}, "Must implement the doTask method");
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Throwable, Task=)} callback
         */
        dequeueTask: function(callback) {
            var _this = this;
            this.doDequeueTask(function(throwable, task) {
                if (!throwable) {
                    if (task) {
                        callback(null, task);
                    } else {
                        _this.retryDequeueTask(100, callback);
                    }
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @protected
         */
        dispatchStarted: function() {
            this.dispatchEvent(new Event(TaskProcessor.EventTypes.STARTED));
        },

        /**
         * @protected
         */
        dispatchStopped: function() {
            this.dispatchEvent(new Event(TaskProcessor.EventTypes.STOPPED));
        },

        /**
         * @protected
         * @param {function(Throwable, Task=)} callback
         */
        doDequeueTask: function(callback) {
            if (this.isStarted()) {
                this.taskManager.dequeueTask(callback);
            } else {
                callback(new Exception("TaskProcessorStopping", {}, "Task processor is stopping"));
            }
        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        processTask: function(callback) {
            var _this       = this;
            var meldTask    = null;
            $series([
                $task(function(flow) {
                    _this.dequeueTask(function(throwable, dequeuedMeldTask) {
                        if (!throwable) {
                            meldTask = dequeuedMeldTask;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    if (meldTask) {
                        _this.doTask(meldTask, function(throwable) {
                            flow.complete(throwable);
                        });
                    } else {
                        flow.complete();
                    }
                })
            ]).execute(callback);
        },

        /**
         * @protected
         */
        repeatProcessTask: function() {
            var _this = this;
            setTimeout(function() {
                _this.tryProcessTask();
            }, 0);
        },

        /**
         * @protected
         * @param {(Task | string)} task
         * @param {function(Throwable=)} callback
         */
        requeueTask: function(task, callback) {
            this.taskManager.requeueTask(task, callback);
        },

        /**
         * @protected
         * @param {number} retryDelay
         * @param {function(Throwable, Task=)} callback
         */
        retryDequeueTask: function(retryDelay, callback) {
            var _this = this;
            setTimeout(function() {
                _this.doDequeueTask(function(throwable, task) {
                    if (!throwable) {
                        if (task) {
                            callback(null, task);
                        } else {
                            if (_this.isStarted()) {
                                retryDelay = retryDelay * 2;
                                if (retryDelay > 5000) {
                                    retryDelay = 5000;
                                }
                                _this.retryDequeueTask(retryDelay, callback);
                            } else {
                                callback(null);
                            }
                        }
                    } else {
                        callback(throwable);
                    }
                });
            }, retryDelay)
        },

        /**
         * @protected
         */
        startProcessingTasks: function() {
            this.state = TaskProcessor.States.STARTED;
            this.dispatchStarted();
            this.tryProcessTask();
        },

        /**
         * @protected
         */
        stopProcessingTasks: function() {
            this.state = TaskProcessor.States.STOPPING;
        },

        /**
         * @protected
         */
        tryProcessTask: function() {
            var _this = this;
            if (this.isStarted()) {
                this.processTask(function(throwable) {
                    if (!throwable) {
                        _this.repeatProcessTask();
                    } else {
                        if (Class.doesExtend(throwable, Exception)) {
                            if (throwable.getType() === "TaskProcessorStopping" && _this.isStopping()) {
                                _this.state = TaskProcessor.States.STOPPED;
                                _this.dispatchStopped();
                            } else {
                                throw throwable;
                            }
                        } else {
                            throw throwable;
                        }
                    }
                });
            } else if (this.isStopping()) {
                this.state = TaskProcessor.States.STOPPED;
                this.dispatchStopped();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    TaskProcessor.EventTypes = {
        STARTED: "TaskProcessor:Started",
        STOPPING: "TaskProcessor:Stopping",
        STOPPED: "TaskProcessor:Stopped"
    };

    /**
     * @static
     * @enum {string}
     */
    TaskProcessor.States = {
        STARTED: "TaskProcessor:Started",
        STOPPING: "TaskProcessor:Stopping",
        STOPPED: "TaskProcessor:Stopped"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugtask.TaskProcessor', TaskProcessor);
});
