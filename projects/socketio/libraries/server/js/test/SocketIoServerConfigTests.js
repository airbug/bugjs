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
//@Require('socketio.SocketIoServerConfig')


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
    var SocketIoServerConfig    = bugpack.require('socketio.SocketIoServerConfig');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestSocketIoServerConfig", function(yarn) {
        yarn.wind({
            socketIoServerConfig: new SocketIoServerConfig({})
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var socketIoServerConfigInstantiationEmptyDataTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testConfigData             = {};
            this.testSocketIoServerConfig   = new SocketIoServerConfig(this.testConfigData);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testSocketIoServerConfig, SocketIoServerConfig),
                "Assert instance of SocketIoServerConfig");
            test.assertEqual(this.testSocketIoServerConfig.getMatchOriginProtocol(), false,
                "Assert #getMatchOriginProtocol returns false by default");
            test.assertEqual(this.testSocketIoServerConfig.getResource(), "/socket.io",
                "Assert #getResource '/socket.io' by default");
            var transports = this.testSocketIoServerConfig.getTransports();
            test.assertEqual(transports[0], "websocket",
                "Assert getTransports[0] is 'websocket'");
            test.assertEqual(transports[1], "jsonp-polling",
                "Assert getTransports[1] is 'jsonp-polling'");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(socketIoServerConfigInstantiationEmptyDataTest).with(
        test().name("SocketIoServerConfig - instantiation with empty data test")
    );
});
