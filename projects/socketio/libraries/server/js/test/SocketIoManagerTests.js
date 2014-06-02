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
//@Require('socketio.SocketIoManager')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var BugYarn             = bugpack.require('bugyarn.BugYarn');
    var SocketIoManager     = bugpack.require('socketio.SocketIoManager');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var bugyarn             = BugYarn.context();
    var test                = TestTag.test;


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


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(socketIoManagerInstantiationTest).with(
        test().name("SocketIoManager - instantiation test")
    );
});
