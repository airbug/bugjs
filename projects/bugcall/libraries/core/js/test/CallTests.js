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
//@Require('TypeUtil')
//@Require('bugcall.Call')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallRequest')
//@Require('bugcall.CallResponseHandler')
//@Require('bugcall.OutgoingRequest')
//@Require('bugcall.RequestFailedException')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var TypeUtil                = bugpack.require('TypeUtil');
    var Call                    = bugpack.require('bugcall.Call');
    var CallConnection          = bugpack.require('bugcall.CallConnection');
    var CallRequest             = bugpack.require('bugcall.CallRequest');
    var CallResponseHandler     = bugpack.require('bugcall.CallResponseHandler');
    var OutgoingRequest         = bugpack.require('bugcall.OutgoingRequest');
    var RequestFailedException  = bugpack.require('bugcall.RequestFailedException');
    var BugDouble               = bugpack.require('bugdouble.BugDouble');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');
    var Logger                  = bugpack.require('loggerbug.Logger');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var spyOnFunction           = BugDouble.spyOnFunction;
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWeaver("testCall", function(yarn, args) {
        yarn.spin([
            "setupTestLogger"
        ]);
        return new Call(this.logger, args[0], args[1], args[2]);
    });

    bugyarn.registerWinder("setupTestCall", function(yarn) {
        yarn.spin([
            "setupTestLogger"
        ]);
        yarn.wind({
            call: new Call(this.logger)
        });
    });


    //-------------------------------------------------------------------------------
    // Test Helpers
    //-------------------------------------------------------------------------------

    var generateDummySocket     = function() {
        return {
            addEventListener: function(eventType, listenerFunction, listenerContext) {

            },
            disconnect: function() {

            },
            emit: function(type, data, callback) {
                callback();
            },
            getSocket: function() {
                return {
                    handshake: {

                    }
                }
            },
            removeEventListener: function(eventType, listenerFunction, listenerContext) {

            }
        };
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var callInstantiationNoArgumentsTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger"
            ]);
            this.testCall       = new Call(this.logger);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testCall.getConnection(), null,
                "Assert #getConnection returns null");
            test.assertEqual(this.testCall.getCallUuid(), "",
                "Assert callUuid is an empty string");
            test.assertEqual(this.testCall.hasConnection(), false,
                "Assert call defaults to having no connection");
            test.assertEqual(this.testCall.isOpen(), false,
                "Assert Call is not open by default");
            test.assertEqual(this.testCall.isReconnect(), false,
                "Assert Call is not a reconnect by default");
        }
    };
    bugmeta.tag(callInstantiationNoArgumentsTest).with(
        test().name("Call - instantiation with no arguments Test")
    );


    var callInstantiationWithArgumentsTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger"
            ]);
            this.testCallType       = "testCallType";
            this.testCallUuid       = "testCallUuid";
            this.testReconnect      = true;
            this.testCall           = new Call(this.logger, this.testCallType, this.testCallUuid, this.testReconnect);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testCall.getConnection(), null,
                "Assert #getConnection returns null");
            test.assertEqual(this.testCall.getCallType(), this.testCallType,
                "Assert Call.testCallType was set correctly");
            test.assertEqual(this.testCall.getCallUuid(), this.testCallUuid,
                "Assert Call callUuid was set by constructor");
            test.assertEqual(this.testCall.hasConnection(), false,
                "Assert call defaults to having no connection");
            test.assertEqual(this.testCall.isOpen(), false,
                "Assert Call is not open by default");
            test.assertEqual(this.testCall.isReconnect(), this.testReconnect,
                "Assert Call reconnect value was set by constructor");
        }
    };
    bugmeta.tag(callInstantiationWithArgumentsTest).with(
        test().name("Call - instantiation with arguments Test")
    );


    var callSendRequestQueuesWhenNotOpenTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                       = this;
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger"
            ]);
            this.testCallType               = "testCallType";
            this.testCallUuid               = "testCallUuid";
            this.testReconnect              = false;
            this.testRequestType            = "testRequestType";
            this.testRequestData            = {};
            this.testCallback               = function(throwable, callResponse) {

            };
            this.testCallResponseHandler    = new CallResponseHandler(this.testCallback);
            this.testCall                   = new Call(this.logger, this.testCallType, this.testCallUuid, this.testReconnect);
            this.testSendCallback           = function(throwable, outgoingRequest) {
                if (!throwable) {
                    test.assertTrue(Class.doesExtend(outgoingRequest, OutgoingRequest),
                        "Assert that outgoingRequest was an instance of OutgoingRequest");
                    test.assertTrue(_this.testCall.getOutgoingRequestQueue().contains(outgoingRequest),
                        "Assert outgoingRequest was queued");
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            };
            this.testSendCallbackSpy        = spyOnFunction(this.testSendCallback);
            test.completeSetup();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var request = new CallRequest(this.testRequestType, this.testRequestData);
            test.assertFalse(this.testCall.isOpen(),
                "Assert call is not open");
            this.testCall.sendRequest(request, this.testCallResponseHandler, this.testSendCallbackSpy);
            test.assertTrue(this.testSendCallbackSpy.wasCalled(),
                "Assert testSendCallback was called");
        }
    };
    bugmeta.tag(callSendRequestQueuesWhenNotOpenTest).with(
        test().name("Call - #sendRequest should queue the request when call is not open test")
    );


    var callCloseCallTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                       = this;
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger"
            ]);
            this.testCallType               = "testCallType";
            this.testCallUuid               = "testCallUuid";
            this.testReconnect              = false;
            this.testRequestType            = "testRequestType";
            this.testRequestData            = {};
            this.testCallback               = function(throwable, callResponse) {
                test.assertTrue(Class.doesExtend(throwable, RequestFailedException),
                    "Assert throwable is a RequestFailedException");
                test.assertEqual(callResponse, null,
                    "Assert callResponse is null");
                test.assertEqual(throwable.getCallRequest(), _this.testRequest,
                    "Assert callRequest is the testRequest");
            };
            this.dummyMarshaller            = {
                marshalData: function() {
                    return "";
                },
                unmarshalData: function() {
                    return {};
                }
            };
            this.testCallbackSpy            = spyOnFunction(this.testCallback);
            this.dummySocketConnection      = generateDummySocket();
            this.testCallConnection         = new CallConnection(this.dummySocketConnection, this.dummyMarshaller);
            this.testCallResponseHandler    = new CallResponseHandler(this.testCallbackSpy);
            this.testCall                   = new Call(this.logger, this.testCallType, this.testCallUuid, this.testReconnect);
            this.testRequest                = new CallRequest(this.testRequestType, this.testRequestData);
            this.testSendCallback           = function(throwable, outgoingRequest) {
                _this.testCall.openCall(_this.testCallConnection);
                _this.testCall.startCall();
                test.assertTrue(_this.testCall.getPendingOutgoingRequestMap().containsValue(outgoingRequest),
                    "Assert outgoingRequest is now pending");
                _this.testCall.closeCall();
                test.assertTrue(_this.testCallbackSpy.wasCalled(),
                    "Assert testCallback was called");
            };
            this.testSendCallbackSpy        = spyOnFunction(this.testSendCallback);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertFalse(this.testCall.isOpen(),
                "Assert call is not open");
            this.testCall.sendRequest(this.testRequest, this.testCallResponseHandler, this.testSendCallback);
        }
    };
    bugmeta.tag(callCloseCallTest).with(
        test().name("Call - #closeCall test")
    );
});
