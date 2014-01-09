//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugcall.BugCallServer')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallEvent')
//@Require('bugcall.CallManager')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


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
var CallManager             = bugpack.require('bugcall.CallManager');
var BugDouble               = bugpack.require('bugdouble.BugDouble');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var spyOnObject             = BugDouble.spyOnObject;
var stubObject              = BugDouble.stubObject;
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var bugCallServerHandleConnectionFailedTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.dummyCallServer        = {
            addEventListener: function() {

            }
        };
        this.dummyRequestProcessor  = {};
        this.dummySocketConnection  = {
            addEventListener: function() {

            }
        };
        this.dummyCallProcessor = {
            processCall: function(callManager, callback) {
                callback();
            }
        };
        this.testCallUuid           = "testCallUuid";
        this.testCallConnection     = new CallConnection(this.dummySocketConnection);
        this.testBugCallServer      = new BugCallServer(this.dummyCallServer, this.dummyRequestProcessor, this.dummyCallProcessor);
        this.testHandshake          = {
            query: {
                reconnect: "false",
                callUuid: this.testCallUuid
            }
        };
        stubObject(this.testCallConnection, {getHandshake: function() {
            return _this.testHandshake;
        }});
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
        var callManager = this.testBugCallServer.getCallManagerForCallUuid(this.testCallUuid);
        test.assertEqual(callManager.getCallUuid(), this.testCallUuid,
            "Assert callUuid of callManager matches the testCallUuid");
        test.assertEqual(callManager.isOpen(), true,
            "Assert call is open");
        this.testBugCallServer.handleConnectionFailed(this.testCallConnection);
        test.assertTrue(this.testListenerSpy.getSpy("handleConnectionClosed").wasCalled(),
            "Assert that the CallEvent.CLOSED event was heard by the testListener");
        test.assertEqual(callManager.isOpen(), false,
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
        this.dummyCallServer        = {
            addEventListener: function() {

            }
        };
        this.dummyRequestProcessor  = {};
        this.dummySocketConnection  = {
            addEventListener: function() {

            }
        };
        this.dummyCallProcessor = {
            processCall: function(callManager, callback) {
                callback();
            }
        };
        this.testCallUuid           = "testCallUuid";
        this.testCallConnection     = new CallConnection(this.dummySocketConnection);
        this.testBugCallServer      = new BugCallServer(this.dummyCallServer, this.dummyRequestProcessor, this.dummyCallProcessor);
        this.testHandshake          = {
            query: {
                reconnect: "false",
                callUuid: this.testCallUuid
            }
        };
        stubObject(this.testCallConnection, {getHandshake: function() {
            return _this.testHandshake;
        }});
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
        var callManager = this.testBugCallServer.getCallManagerForCallUuid(this.testCallUuid);
        test.assertEqual(callManager.getCallUuid(), this.testCallUuid,
            "Assert callUuid of callManager matches the testCallUuid");
        test.assertEqual(callManager.isOpen(), true,
            "Assert call is open");
        this.testBugCallServer.handleConnectionClosed(this.testCallConnection);
        test.assertTrue(this.testListenerSpy.getSpy("handleConnectionClosed").wasCalled(),
            "Assert that the CallEvent.CLOSED event was heard by the testListener");
        test.assertEqual(callManager.isOpen(), false,
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
        this.dummyCallServer        = {
            addEventListener: function() {

            }
        };
        this.dummyRequestProcessor  = {};
        this.dummySocketConnection  = {
            addEventListener: function() {

            }
        };
        this.dummyCallProcessor = {
            processCall: function(callManager, callback) {
                callback();
            }
        };
        this.testCallUuid           = "testCallUuid";
        this.testCallConnection     = new CallConnection(this.dummySocketConnection);
        this.testBugCallServer      = new BugCallServer(this.dummyCallServer, this.dummyRequestProcessor, this.dummyCallProcessor);
        this.testHandshake          = {
            query: {
                reconnect: "false",
                callUuid: this.testCallUuid
            }
        };
        stubObject(this.testCallConnection, {getHandshake: function() {
            return _this.testHandshake;
        }});
        this.testListener = {
            handleConnectionEstablished: function(event) {
                var callManager = event.getData().callManager;
                test.assertEqual(callManager.isReconnect(), false,
                    "Assert that this is not a reconnect");
                test.assertEqual(callManager.getCallUuid(), _this.testCallUuid,
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
        var callManager = this.testBugCallServer.getCallManagerForCallUuid(this.testCallUuid);
        test.assertEqual(callManager.getCallUuid(), this.testCallUuid,
            "Assert callUuid of callManager matches the testCallUuid");
        test.assertEqual(callManager.isOpen(), true,
            "Assert call is open");
        test.assertTrue(this.testListenerSpy.getSpy("handleConnectionEstablished").wasCalled(),
            "Assert that the CallEvent.CLOSED event was heard by the testListener");
    }
};
bugmeta.annotate(bugCallServerHandleConnectionEstablishedTest).with(
    test().name("BugCallServer - #handleConnectionEstablished Test")
);