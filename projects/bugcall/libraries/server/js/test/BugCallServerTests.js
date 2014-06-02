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

//@Require('bugcall.BugCallServer')
//@Require('bugcall.Call')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallEvent')
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

    var BugCallServer   = bugpack.require('bugcall.BugCallServer');
    var Call            = bugpack.require('bugcall.Call');
    var CallConnection  = bugpack.require('bugcall.CallConnection');
    var CallEvent       = bugpack.require('bugcall.CallEvent');
    var BugDouble       = bugpack.require('bugdouble.BugDouble');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');
    var Logger          = bugpack.require('loggerbug.Logger');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var spyOnObject     = BugDouble.spyOnObject;
    var stubObject      = BugDouble.stubObject;
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestBugCallServer", function(yarn) {
        yarn.spin([
            "setupTestLogger",
            "setupTestCallServer",
            "setupTestRequestProcessor",
            "setupTestCallProcessor"
        ]);
        yarn.wind({
            bugCallServer: new BugCallServer(this.logger, this.callServer, this.requestProcessor, this.callProcessor)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var bugCallServerHandleConnectionFailedTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestBugCallServer"
            ]);
            this.testCallConnection = yarn.weave("testCallConnection");
            this.testCallUuid       = "testCallUuid";
            this.testHandshake          = {
                query: {
                    reconnect: "false",
                    callUuid: this.testCallUuid
                }
            };
            stubObject(this.testCallConnection, {
                getHandshake: function() {
                    return _this.testHandshake;
                }
            });

            this.testListener       = {
                handleConnectionClosed: function(event) {}
            };
            this.testListenerSpy    = spyOnObject(this.testListener);
            this.bugCallServer.addEventListener(CallEvent.CLOSED, this.testListener.handleConnectionClosed, this.testListener);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.bugCallServer.handleConnectionEstablished(this.testCallConnection);
            var call = this.bugCallServer.getCallForCallUuid(this.testCallUuid);
            test.assertEqual(call.getCallUuid(), this.testCallUuid,
                "Assert callUuid of call matches the testCallUuid");
            test.assertEqual(call.isOpen(), true,
                "Assert call is open");
            this.bugCallServer.handleConnectionFailed(this.testCallConnection);
            test.assertTrue(this.testListenerSpy.getSpy("handleConnectionClosed").wasCalled(),
                "Assert that the CallEvent.CLOSED event was heard by the testListener");
            test.assertEqual(call.isOpen(), false,
                "Assert call is closed");
        }
    };

    var bugCallServerHandleConnectionClosedTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestBugCallServer"
            ]);
            this.testCallConnection = yarn.weave("testCallConnection");
            this.testCallUuid       = "testCallUuid";
            this.testHandshake          = {
                query: {
                    reconnect: "false",
                    callUuid: this.testCallUuid
                }
            };
            stubObject(this.testCallConnection, {
                getHandshake: function() {
                    return _this.testHandshake;
                }
            });
            this.testListener = {
                handleConnectionClosed: function(event) {}
            };
            this.testListenerSpy = spyOnObject(this.testListener);
            this.bugCallServer.addEventListener(CallEvent.CLOSED, this.testListener.handleConnectionClosed, this.testListener);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.bugCallServer.handleConnectionEstablished(this.testCallConnection);
            var call = this.bugCallServer.getCallForCallUuid(this.testCallUuid);
            test.assertEqual(call.getCallUuid(), this.testCallUuid,
                "Assert callUuid of call matches the testCallUuid");
            test.assertEqual(call.isOpen(), true,
                "Assert call is open");
            this.bugCallServer.handleConnectionClosed(this.testCallConnection);
            test.assertTrue(this.testListenerSpy.getSpy("handleConnectionClosed").wasCalled(),
                "Assert that the CallEvent.CLOSED event was heard by the testListener");
            test.assertEqual(call.isOpen(), false,
                "Assert call is closed");
        }
    };

    var bugCallServerHandleConnectionEstablishedTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestBugCallServer"
            ]);
            this.testCallConnection = yarn.weave("testCallConnection");
            this.testCallUuid       = "testCallUuid";
            this.testHandshake          = {
                query: {
                    reconnect: "false",
                    callUuid: this.testCallUuid
                }
            };
            stubObject(this.testCallConnection, {
                getHandshake: function() {
                    return _this.testHandshake;
                }
            });
            this.testListener = {
                handleConnectionEstablished: function(event) {
                    var call = event.getData().call;
                    test.assertEqual(call.isReconnect(), false,
                        "Assert that this is not a reconnect");
                    test.assertEqual(call.getCallUuid(), _this.testCallUuid,
                        "Assert callUuid is testCallUuid");
                }
            };
            this.testListenerSpy = spyOnObject(this.testListener);
            this.bugCallServer.addEventListener(CallEvent.OPENED, this.testListener.handleConnectionEstablished, this.testListener);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.bugCallServer.handleConnectionEstablished(this.testCallConnection);
            var call = this.bugCallServer.getCallForCallUuid(this.testCallUuid);
            test.assertEqual(call.getCallUuid(), this.testCallUuid,
                "Assert callUuid of call matches the testCallUuid");
            test.assertEqual(call.isOpen(), true,
                "Assert call is open");
            test.assertTrue(this.testListenerSpy.getSpy("handleConnectionEstablished").wasCalled(),
                "Assert that the CallEvent.CLOSED event was heard by the testListener");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(bugCallServerHandleConnectionFailedTest).with(
        test().name("BugCallServer - #handleConnectionFailed Test")
    );
    bugmeta.tag(bugCallServerHandleConnectionClosedTest).with(
        test().name("BugCallServer - #handleConnectionClosed Test")
    );
    bugmeta.tag(bugCallServerHandleConnectionEstablishedTest).with(
        test().name("BugCallServer - #handleConnectionEstablished Test")
    );
});
