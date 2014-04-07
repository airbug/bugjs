//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('socketio:socket.DummySocketConnection')
//@Require('socketio:socket.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var DummySocketConnection   = bugpack.require('socketio:socket.DummySocketConnection');
var SocketIoConnection      = bugpack.require('socketio:socket.SocketIoConnection');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("dummySocketIoConnection", function(yarn) {
    return new DummySocketConnection(false);
});

bugyarn.registerWinder("setupDummySocketIoConnection", function(yarn) {
    yarn.wind({
        socketIoConnection: new DummySocketConnection(false)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var socketIoConnectionInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testSocket                 = {
            addListener: function() {},
            emit: function() {},
            removeListener: function() {}
        };
        this.testConnected              = false;
        this.testSocketIoConnection     = new SocketIoConnection(this.testSocket, this.testConnected);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testSocketIoConnection, SocketIoConnection),
            "Assert instance of SocketIoConnection");
        test.assertEqual(this.testSocketIoConnection.getSocket(), this.testSocket,
            "Assert .socket was set correctly");
        test.assertEqual(this.testSocketIoConnection.getConnected(), this.testConnected,
            "Assert .connected was set correctly");
    }
};
bugmeta.annotate(socketIoConnectionInstantiationTest).with(
    test().name("SocketIoConnection - instantiation test")
);
