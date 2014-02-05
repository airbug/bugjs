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
var Logger                  = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var spyOnObject             = BugDouble.spyOnObject;
var stubObject              = BugDouble.stubObject;
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Helper Methods
//-------------------------------------------------------------------------------

var setupTestServer  = function(testObject) {
    testObject.dummyCallServer        = {
        addEventListener: function() {

        }
    };
    testObject.dummyRequestProcessor  = {};
    testObject.dummySocketConnection  = {
        addEventListener: function() {

        }
    };
    testObject.dummyCallProcessor = {
        processCall: function(call, callback) {
            callback();
        }
    };
    testObject.testCallUuid           = "testCallUuid";
    testObject.testCallConnection     = new CallConnection(testObject.dummySocketConnection);
    testObject.logger                 = new Logger();
    testObject.testBugCallServer      = new BugCallServer(testObject.logger, testObject.dummyCallServer, testObject.dummyRequestProcessor, testObject.dummyCallProcessor);
    testObject.testHandshake          = {
        query: {
            reconnect: "false",
            callUuid: testObject.testCallUuid
        }
    };
    stubObject(testObject.testCallConnection, {getHandshake: function() {
        return testObject.testHandshake;
    }});
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var bugCallServerHandleConnectionFailedTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        setupTestServer(this);
        this.testListener = {
            handleConnectionClosed: function(event) {}
        };
        this.testListenerSpy = spyOnObject(this.testListener);
        this.testBugCallServer.addEventListener(CallEvent.CLOSED, this.testListener.handleConnectionClosed, this.testListener);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testBugCallServer.handleConnectionEstablished(this.testCallConnection);
        var call = this.testBugCallServer.getCallForCallUuid(this.testCallUuid);
        test.assertEqual(call.getCallUuid(), this.testCallUuid,
            "Assert callUuid of call matches the testCallUuid");
        test.assertEqual(call.isOpen(), true,
            "Assert call is open");
        this.testBugCallServer.handleConnectionFailed(this.testCallConnection);
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
        setupTestServer(this);
        this.testListener = {
            handleConnectionClosed: function(event) {}
        };
        this.testListenerSpy = spyOnObject(this.testListener);
        this.testBugCallServer.addEventListener(CallEvent.CLOSED, this.testListener.handleConnectionClosed, this.testListener);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testBugCallServer.handleConnectionEstablished(this.testCallConnection);
        var call = this.testBugCallServer.getCallForCallUuid(this.testCallUuid);
        test.assertEqual(call.getCallUuid(), this.testCallUuid,
            "Assert callUuid of call matches the testCallUuid");
        test.assertEqual(call.isOpen(), true,
            "Assert call is open");
        this.testBugCallServer.handleConnectionClosed(this.testCallConnection);
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
        setupTestServer(this);
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
        this.testBugCallServer.addEventListener(CallEvent.OPENED, this.testListener.handleConnectionEstablished, this.testListener);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testBugCallServer.handleConnectionEstablished(this.testCallConnection);
        var call = this.testBugCallServer.getCallForCallUuid(this.testCallUuid);
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