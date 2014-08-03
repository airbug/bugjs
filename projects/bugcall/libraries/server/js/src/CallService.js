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

//@Export('bugcall.CallService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Obj')
//@Require('Set')
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
    var CallService = Class.extend(Obj, {

        _name: "bugcall.CallService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {BugCallServer} bugCallServer
         * @param {CallManager} callManager
         * @param {PersistedCallFactory} persistedCallFactory
         */
        _constructor: function(logger, bugCallServer, callManager, persistedCallFactory) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BugCallServer}
             */
            this.bugCallServer              = bugCallServer;

            /**
             * @private
             * @type {CallManager}
             */
            this.callManager                = callManager;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                     = logger;

            /**
             * @private
             * @type {PersistedCallFactory}
             */
            this.persistedCallFactory       = persistedCallFactory;
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
         * @return {CallManager}
         */
        getCallManager: function() {
            return this.callManager;
        },

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {PersistedCallFactory}
         */
        getPersistedCallFactory: function() {
            return this.persistedCallFactory;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            this.bugCallServer.off(CallEvent.CLOSED, this.hearCallClosed, this);
            this.bugCallServer.deregisterCallProcessor(this);
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            this.bugCallServer.on(CallEvent.CLOSED, this.hearCallClosed, this);
            this.bugCallServer.registerCallProcessor(this);
            callback();
        },


        //-------------------------------------------------------------------------------
        // IProcessCall Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Call} call
         * @param {function(Throwable=)} callback
         */
        processCall: function(call, callback) {
            var _this           = this;
            /** @type {PersistedCall} */
            var persistedCall   = null;

            $if(function(flow) {
                    _this.callManager.getCallByCallUuid(call.getCallUuid(), function(throwable, retrievedPersistedCall) {
                        if (!throwable) {
                            persistedCall = retrievedPersistedCall;
                            flow.assert(!persistedCall);
                        } else {
                            flow.error(throwable);
                        }
                    });
                },
                $task(function(flow) {
                    persistedCall = _this.persistedCallFactory.factoryPersistedCall(call.getCallType(), call.getCallUuid(), call.isReconnect(), call.isOpen());
                    _this.callManager.setCall(persistedCall, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ).$else(
                $task(function(flow) {
                    persistedCall.setOpen(true);
                    persistedCall.setReconnect(call.isReconnect());
                    _this.callManager.setCall(persistedCall, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Call} call
         */
        handleCallClosed: function(call) {
            var _this = this;
            /** @type {PersistedCall} */
            var persistedCall   = null;
            $series([
                $task(function(flow) {
                    _this.callManager.getCallByCallUuid(call.getCallUuid(), function(throwable, retrievedPersistedCall) {
                        if (!throwable) {
                            if (retrievedPersistedCall) {
                                persistedCall = retrievedPersistedCall;
                            } else {
                                throwable = new Exception("NotFound", {}, "Could not find PersistedCall with the callUuid:" + call.getCallUuid());
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    persistedCall.setOpen(false);
                    _this.callManager.setCall(persistedCall, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (throwable) {
                    _this.logger.error(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {CallEvent} event
         */
        hearCallClosed: function(event) {
            var data            = event.getData();
            var call            = data.call;
            this.handleCallClosed(call);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(CallService, IInitializingModule);
    Class.implement(CallService, IProcessCall);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallService).with(
        module("callService")
            .args([
                arg().ref("logger"),
                arg().ref("bugCallServer"),
                arg().ref("callManager"),
                arg().ref("persistedCallFactory")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallService', CallService);
});
