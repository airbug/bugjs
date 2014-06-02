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

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('socketio.DummySocketFactory')
//@Require('socketio.SocketIoClient')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var DummySocketFactory  = bugpack.require('socketio.DummySocketFactory');
    var SocketIoClient      = bugpack.require('socketio.SocketIoClient');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


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


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(socketIoClientConstructorTest).with(
        test().name("SocketIoClient constructor Test")
    );
    bugmeta.tag(socketIoClientConnectTest).with(
        test().name("SocketIoClient connect Test")
    );
});
