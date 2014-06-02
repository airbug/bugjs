//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('socketio:server.SocketIoServer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var SocketIoServer          = bugpack.require('socketio:server.SocketIoServer');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupDummySocketIoServer", function(yarn) {
    var dummySocketIoServer = {
        addEventListener: function() {},
        configure: function() {},
        of: function() {
            return {
                on: function() {

                }
            };
        }
    };
    yarn.wind({
        socketIoServer: dummySocketIoServer
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var socketIoServerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestSocketIoServerConfig",
            "setupTestExpressServer",
            "setupTestHandshaker"
        ]);
        this.testSocketIoServer     = new SocketIoServer(this.socketIoServerConfig, this.expressServer, this.handshaker);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testSocketIoServer, SocketIoServer),
            "Assert instance of SocketIoServer");
        test.assertEqual(this.testSocketIoServer.getConfig(), this.socketIoServerConfig,
            "Assert .config was set correctly");
        test.assertEqual(this.testSocketIoServer.getExpressServer(), this.expressServer,
            "Assert .expressServer was set correctly");
        test.assertEqual(this.testSocketIoServer.getHandshaker(), this.handshaker,
            "Assert .handshaker was set correctly");
    }
};
bugmeta.tag(socketIoServerInstantiationTest).with(
    test().name("SocketIoServer - instantiation test")
);
