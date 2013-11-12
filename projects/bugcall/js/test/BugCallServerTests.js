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
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var bugCallServerHandleConnectionFailedTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.dummyCallServer        = {
            addEventListener: function() {

            }
        };
        this.dummyRequestProcessor  = {};
        this.dummySocketConnection  = {
            addEventListener: function() {

            }
        };
        this.testCallUuid           = "testCallUuid";
        this.testCallConnection     = new CallConnection(this.dummySocketConnection);
        this.testBugCallServer      = new BugCallServer(this.dummyCallServer, this.dummyRequestProcessor);
        this.testCallManager        = new CallManager(this.testCallUuid);
        this.testBugCallServer.addCallManager(this.testCallManager);
        this.testBugCallServer.mapCallConnectionToCallManager(this.testCallConnection, this.testCallManager);
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
        this.testBugCallServer.handleConnectionFailed(this.testCallConnection);
        test.assertTrue(this.testListenerSpy.getSpy("handleConnectionClosed").wasCalled(),
            "Assert that the CallEvent.CLOSED event was heard by the testListener");
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
        this.dummyCallServer        = {
            addEventListener: function() {

            }
        };
        this.dummyRequestProcessor  = {};
        this.dummySocketConnection  = {
            addEventListener: function() {

            }
        };
        this.testCallUuid           = "testCallUuid";
        this.testCallConnection     = new CallConnection(this.dummySocketConnection);
        this.testBugCallServer      = new BugCallServer(this.dummyCallServer, this.dummyRequestProcessor);
        this.testCallManager        = new CallManager(this.testCallUuid);
        this.testBugCallServer.addCallManager(this.testCallManager);
        this.testBugCallServer.mapCallConnectionToCallManager(this.testCallConnection, this.testCallManager);
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
        this.testBugCallServer.handleConnectionClosed(this.testCallConnection);
        test.assertTrue(this.testListenerSpy.getSpy("handleConnectionClosed").wasCalled(),
            "Assert that the CallEvent.CLOSED event was heard by the testListener");
    }
};
bugmeta.annotate(bugCallServerHandleConnectionClosedTest).with(
    test().name("BugCallServer - #handleConnectionClosed Test")
);