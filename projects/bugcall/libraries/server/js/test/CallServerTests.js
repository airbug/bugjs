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
//@Require('bugcall.CallServer')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var CallServer  = bugpack.require('bugcall.CallServer');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');
    var BugYarn     = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var bugyarn     = BugYarn.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupDummyCallServer", function(yarn) {
        var dummyCallServer = {
            addEventListener: function() {}
        };
        yarn.wind({
            callServer: dummyCallServer
        });
    });

    bugyarn.registerWinder("setupTestCallServer", function(yarn) {
        yarn.spin([
            "setupDummySocketIoManager",
            "setupTestMarshaller"
        ]);
        yarn.wind({
            callServer: new CallServer(this.socketIoManager, this.marshaller)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var callServerInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupDummySocketIoManager",
                "setupTestMarshaller"
            ]);
            this.testCallServer         = new CallServer(this.socketIoManager, this.marshaller);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCallServer, CallServer),
                "Assert instance of CallServer");
            test.assertEqual(this.testCallServer.getSocketIoManager(), this.socketIoManager,
                "Assert .socketIoManager was set correctly");
            test.assertEqual(this.testCallServer.getMarshaller(), this.marshaller,
                "Assert .marshaller was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(callServerInstantiationTest).with(
        test().name("CallServer - instantiation test")
    );
});
