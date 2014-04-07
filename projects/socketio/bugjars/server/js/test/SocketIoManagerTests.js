//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('socketio:server.SocketIoManager')


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
var SocketIoManager         = bugpack.require('socketio:server.SocketIoManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupDummySocketIoManager", function(yarn) {
    var dummySocketIoManager = {
        addEventListener: function() {},
        initialize: function() {}
    };
    yarn.wind({
        socketIoManager: dummySocketIoManager
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var socketIoManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupDummySocketIoServer"
        ]);
        this.testNamespace          = "testNamespace";
        this.testSocketIoManager    = new SocketIoManager(this.socketIoServer, this.testNamespace);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testSocketIoManager, SocketIoManager),
            "Assert instance of SocketIoManager");
        test.assertEqual(this.testSocketIoManager.getSocketIoServer(), this.socketIoServer,
            "Assert .socketIoServer was set correctly");
        test.assertEqual(this.testSocketIoManager.getNamespace(), this.testNamespace,
            "Assert .namespace was set correctly");
    }
};
bugmeta.annotate(socketIoManagerInstantiationTest).with(
    test().name("SocketIoManager - instantiation test")
);
