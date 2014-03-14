//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugcall.BugCallServer')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallEvent')
//@Require('bugcall.Call')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugCallServer           = bugpack.require('bugcall.BugCallServer');
var CallConnection          = bugpack.require('bugcall.CallConnection');
var CallEvent               = bugpack.require('bugcall.CallEvent');
var Call                    = bugpack.require('bugcall.Call');
var BugDouble               = bugpack.require('bugdouble.BugDouble');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var Logger                  = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var spyOnObject             = BugDouble.spyOnObject;
var stubObject              = BugDouble.stubObject;
var test                    = TestAnnotation.test;


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
bugmeta.annotate(bugCallServerHandleConnectionFailedTest).with(
    test().name("BugCallServer - #handleConnectionFailed Test")
);

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
bugmeta.annotate(bugCallServerHandleConnectionClosedTest).with(
    test().name("BugCallServer - #handleConnectionClosed Test")
);

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
bugmeta.annotate(bugCallServerHandleConnectionEstablishedTest).with(
    test().name("BugCallServer - #handleConnectionEstablished Test")
);
