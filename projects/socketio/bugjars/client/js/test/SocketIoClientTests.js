//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('socketio:client.DummySocketFactory')
//@Require('socketio:socket.SocketIoClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit.TestAnnotation');
var DummySocketFactory  = bugpack.require('socketio:client.DummySocketFactory');
var SocketIoClient      = bugpack.require('socketio:socket.SocketIoClient');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var socketIoClientConstructorTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.socketIoClient = new SocketIoClient({}, {});
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.socketIoClient.isConnected(), false,
            "Asserts that socketIoClient does not start with the 'connected' flag as true");
        test.assertEqual(this.socketIoClient.isConnecting(), false,
            "Asserts that socketIoClient does not start with the 'connecting' flag as true");
    }
};
bugmeta.annotate(socketIoClientConstructorTest).with(
    test().name("SocketIoClient constructor Test")
);


var socketIoClientConnectTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.dummySocketFactory = new DummySocketFactory(false);
        this.socketIoClient = new SocketIoClient(this.dummySocketFactory, {});
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {

    }
};
bugmeta.annotate(socketIoClientConnectTest).with(
    test().name("SocketIoClient connect Test")
);
