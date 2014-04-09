//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var CallEvent               = bugpack.require('bugcall.CallEvent');
var IProcessCall            = bugpack.require('bugcall.IProcessCall');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule       = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $if                     = BugFlow.$if;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IInitializeModule}
 * @implements {IProcessCall}
 */
var CallService = Class.extend(Obj, {

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
        // Declare Variables
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
    // IInitializeModule Implementation
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
                persistedCall = _this.persistedCallFactory.factoryPersistedCall(call.getCallUuid(), call.isReconnect(), call.isOpen());
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

Class.implement(CallService, IInitializeModule);
Class.implement(CallService, IProcessCall);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallService).with(
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
