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
//@Require('bugcall.CallConnection')
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

    var Class           = bugpack.require('Class');
    var CallConnection  = bugpack.require('bugcall.CallConnection');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWeaver("testCallConnection", function(yarn) {
        yarn.spin([
            "setupTestMarshaller"
        ]);
        var dummySocketIoConnection = yarn.weave("dummySocketIoConnection");
        return new CallConnection(dummySocketIoConnection, this.marshaller);
    });

    bugyarn.registerWinder("setupTestCallConnection", function(yarn) {
        yarn.spin([
            "setupDummySocketIoConnection",
            "setupTestMarshaller"
        ]);
        yarn.wind({
            callConnection: new CallConnection(this.socketIoConnection, this.marshaller)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var callConnectionInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupDummySocketIoConnection",
                "setupTestMarshaller"
            ]);
            this.testCallConnection     = new CallConnection(this.socketIoConnection, this.marshaller)
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCallConnection, CallConnection),
                "Assert instance of CallConnection");
            test.assertEqual(this.testCallConnection.getSocketConnection(), this.socketIoConnection,
                "Assert that .socketConnection was set correctly");
            test.assertEqual(this.testCallConnection.getMarshaller(), this.marshaller,
                "Assert that .marshaller was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(callConnectionInstantiationTest).with(
        test().name("CallConnection - instantiation test")
    );
});
