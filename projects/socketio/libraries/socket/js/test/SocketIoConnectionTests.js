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
//@Require('socketio.DummySocketConnection')
//@Require('socketio.SocketIoConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag          = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');
    var DummySocketConnection   = bugpack.require('socketio.DummySocketConnection');
    var SocketIoConnection      = bugpack.require('socketio.SocketIoConnection');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestTag.test;


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


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(socketIoConnectionInstantiationTest).with(
        test().name("SocketIoConnection - instantiation test")
    );
});
