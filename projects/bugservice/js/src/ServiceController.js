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

//@Export('bugservice.ServiceController')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var Obj         = bugpack.require('Obj');
    var Set         = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ServiceController = Class.extend(Obj, {

        _name: "bugservice.ServiceController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {BugCallRouter} bugCallRouter
         */
        _constructor: function(bugCallRouter) {

            this._super();

            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BugCallRouter}
             */
            this.bugCallRouter      = bugCallRouter;

            /**
             * @private
             * @type {Set.<*>}
             */
            this.serviceSet         = new Set();
        },


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        registerServiceRoute: function(serviceRoute) {

        },

        /**
         *
         */
        configure: function(callback){
            var _this = this;
            this.bugCallRouter.addAll({
                acquireLock: function(request, responder) {
                    var data        = request.getData();
                    var lockType    = data.type;
                    var key         = data.key;
                    var consumer    = _this.consumerManager.getConsumerForCall(request.getCall());
                    _this.serverCacheService.acquireLock(consumer, key, lockType, function(error) {
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {key: key};
                            response    = responder.response("acquireLockResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("acquireLockException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("acquireLockError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                },
                add: function(request, responder) {
                    var data    = request.getData();
                    var options = data.options;
                    var key     = data.key;
                    var value   = data.value;
                    var consumer    = _this.consumerManager.getConsumerForCall(request.getCall());
                    _this.serverCacheService.add(consumer, key, value, options, function(error) {
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {key: key};
                            response    = responder.response("addResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("addException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("addError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                },
                delete: function(request, responder) {
                    var data    = request.getData();
                    var options = data.options;
                    var key     = data.key;
                    _this.serverCacheService.delete(key, options, function(error) {
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {key: key};
                            response    = responder.response("deleteResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("deleteException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("deleteError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                },
                get: function(request, responder){
                    var data    = request.getData();
                    var options = data.options;
                    var key     = data.key;
                    var consumer    = _this.consumerManager.getConsumerForCall(request.getCall());
                    _this.serverCacheService.get(consumer, key, options, function(error, value) {
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {
                                key: key,
                                value: value
                            };
                            response    = responder.response("getResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("getException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("getError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                },
                releaseLock: function(request, responder) {
                    var data        = request.getData();
                    var lockType    = data.type;
                    var key         = data.key;
                    _this.serverCacheService.releaseLock(key, lockType, function(error) {
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {
                                key: key
                            };
                            response    = responder.response("releaseLockResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("releaseLockException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("releaseLockError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                },
                set: function(request, responder) {
                    var data    = request.getData();
                    var options = data.options;
                    var key     = data.key;
                    var value   = data.value;
                    var consumer    = _this.consumerManager.getConsumerForCall(request.getCall());
                    _this.serverCacheService.set(consumer, key, value, options, function(error) {
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {
                                key: key
                            };
                            response    = responder.response("setResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("setException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("setError", data);
                            }
                        }
                        responder.sendResponse(response);
                    })
                },
                sync: function(request, responder) {
                    var data    = request.getData();
                    var options = data.options;
                    var key     = data.key;
                    var consumer    = _this.consumerManager.getConsumerForCall(request.getCall());
                    _this.serverCacheService.sync(consumer, key, options, function(error){
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {key: key};
                            response    = responder.response("syncResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("syncException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("syncError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                },
                syncAll: function(request, responder) {
                    var data    = request.getData();
                    var options = data.options;
                    var keys    = data.keys;
                    var consumer    = _this.consumerManager.getConsumerForCall(request.getCall());
                    _this.serverCacheService.syncAll(consumer, keys, options, function(error){
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {key: key};
                            response    = responder.response("syncAllResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("syncAllException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("syncAllError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                },
                unsync: function(request, responder) {
                    var data    = request.getData();
                    var options = data.options;
                    var key     = data.key;
                    var consumer    = _this.consumerManager.getConsumerForCall(request.getCall());
                    _this.serverCacheService.unsync(consumer, key, options, function(error){
                        var data        = null;
                        var response    = null;
                        if (!error) {
                            data        = {key: key};
                            response    = responder.response("unsyncResponse", data);
                        } else {
                            if (Class.doesExtend(error, Exception)) {
                                var exception = error;
                                data        = {
                                    key: key,
                                    exception: exception.toObject()
                                };
                                response    = responder.response("unsyncException", data);
                            } else {
                                //TODO BRN: This should not be sent out if we are in prod mode
                                data    = {
                                    key: key,
                                    error: error.message
                                };
                                response    = responder.response("unsyncError", data);
                            }
                        }
                        responder.sendResponse(response);
                    });
                }
            })
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugservice.ServiceController', ServiceController);
});
