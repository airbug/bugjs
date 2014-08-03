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

//@Export('bugcall.CallRequestService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Flows                   = bugpack.require('Flows');
    var Obj                     = bugpack.require('Obj');
    var CallEvent               = bugpack.require('bugcall.CallEvent');
    var IProcessCall            = bugpack.require('bugcall.IProcessCall');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $if                     = Flows.$if;
    var $parallel               = Flows.$parallel;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     * @implements {IProcessCall}
     */
    var CallRequestService = Class.extend(Obj, {

        _name: "bugcall.CallRequestService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {BugCallServer} bugCallServer
         * @param {CallRequestPublisher} callRequestPublisher
         * @param {CallResponseHandlerFactory} callResponseHandlerFactory
         * @param {CallRequestFactory} callRequestFactory
         */
        _constructor: function(logger, bugCallServer, callRequestPublisher, callResponseHandlerFactory, callRequestFactory) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BugCallServer}
             */
            this.bugCallServer                  = bugCallServer;

            /**
             * @private
             * @type {CallRequestFactory}
             */
            this.callRequestFactory             = callRequestFactory;

            /**
             * @private
             * @type {CallRequestPublisher}
             */
            this.callRequestPublisher           = callRequestPublisher;

            /**
             * @private
             * @type {CallResponseHandlerFactory}
             */
            this.callResponseHandlerFactory     = callResponseHandlerFactory;

            /**
             * @private
             * @type {boolean}
             */
            this.initialized                    = false;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                         = logger;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {BugCallServer}
         */
        getBugCallServer: function() {
            return this.bugCallServer;
        },

        /**
         * @return {CallRequestFactory}
         */
        getCallRequestFactory: function() {
            return this.callRequestFactory;
        },

        /**
         * @return {CallRequestPublisher}
         */
        getCallRequestPublisher: function() {
            return this.callRequestPublisher;
        },

        /**
         * @return {CallResponseHandlerFactory}
         */
        getCallResponseHandlerFactory: function() {
            return this.callResponseHandlerFactory;
        },

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {boolean}
         */
        isInitialized: function() {
            return this.initialized;
        },


        //-------------------------------------------------------------------------------
        // IProcessCall Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Call} call
         * @param {function(Throwable=)} callback
         */
        processCall: function(call, callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.callRequestPublisher.subscribeToCallRequestsForCall(call.getCallUuid(), _this.receiveCallRequestMessage, _this, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            if (this.isInitialized()) {
                this.initialized = false;
                this.bugCallServer.off(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
                this.bugCallServer.deregisterCallProcessor(this);
            }
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            if (!this.isInitialized()) {
                this.initialized = true;
                this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
                this.bugCallServer.registerCallProcessor(this);
            }
            callback();
        },


        //-------------------------------------------------------------------------------
        // Message Subscribers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Message} message
         */
        receiveCallRequestMessage: function(message) {
            var _this           = this;
            var messageData     = message.getMessageData();
            var callUuid        = messageData.callUuid;

            //TODO BRN: We need to ensure the order in which the CallRequests are sent is maintained.
            // If one CallRequest to the client fails then it needs to be retried and verified before processing the next.

            var call            = this.bugCallServer.getCallForCallUuid(callUuid);
            if (call && call.isOpen()) {
                var callRequest         = this.callRequestFactory.buildCallRequest(messageData.callRequest);
                var callResponseHandler = this.callResponseHandlerFactory.factoryCallResponseHandler(function(throwable, callResponse) {
                    if (!throwable) {
                        _this.callRequestPublisher.publishCallResponse(message, callResponse, function(throwable, numberReceived) {

                            //TODO BRN: What do we do here if we receive a throwable or the numberReceived is 0 or greater than 1?
                            // If it's 1 then that's the expected response.

                            if (throwable) {
                                _this.logger.error(throwable);
                            } else {
                                _this.logger.log("Publish callResponse success - numberReceived:", numberReceived);
                            }
                        });
                    } else {
                        _this.callRequestPublisher.publishThrowable(message, throwable, function(throwable, numberReceived) {
                            //TODO BRN: Check for recoverable exceptions. Request should be retried. Requeue request
                            if (throwable) {
                                _this.logger.error(throwable);
                            }
                        });
                    }
                });
                call.sendRequest(callRequest, callResponseHandler, function(throwable) {
                    if (throwable) {
                        _this.logger.error(throwable);
                    }
                });
            } else {
                _this.callRequestPublisher.publishThrowable(message, new Exception("CallClosed"), function(throwable, numberReceived) {

                    //TODO BRN: What do we do here if we receive a throwable or the numberReceived is 0 or greater than 1?
                    // If it's 1 then that's the expected response.

                    if (throwable) {
                        _this.logger.error(throwable);
                    } else {
                        _this.logger.log("Publish callResponse success - numberReceived:", numberReceived);
                    }
                });
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {CallEvent} event
         */
        hearBugCallServerCallClosed: function(event) {
            var _this       = this;
            var data        = event.getData();
            var call        = data.call;
            this.callRequestPublisher.unsubscribeFromCallRequestsForCall(call.getCallUuid(), this.receiveCallRequestMessage, this, function(throwable) {
                if (throwable) {
                    _this.logger.error(throwable);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(CallRequestService, IInitializingModule);
    Class.implement(CallRequestService, IProcessCall);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallRequestService).with(
        module("callRequestService")
            .args([
                arg().ref("logger"),
                arg().ref("bugCallServer"),
                arg().ref("callRequestPublisher"),
                arg().ref("callResponseHandlerFactory"),
                arg().ref("callRequestFactory")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallRequestService', CallRequestService);
});
