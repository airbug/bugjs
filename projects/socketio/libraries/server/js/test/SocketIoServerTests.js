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
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('socketio.SocketIoServer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');
    var SocketIoServer  = bugpack.require('socketio.SocketIoServer');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var test            = TestTag.test;


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


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(socketIoServerInstantiationTest).with(
        test().name("SocketIoServer - instantiation test")
    );
});
