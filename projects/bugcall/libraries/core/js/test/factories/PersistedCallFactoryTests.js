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
//@Require('TypeUtil')
//@Require('bugcall.PersistedCall')
//@Require('bugcall.PersistedCallFactory')
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

    var Class                   = bugpack.require('Class');
    var TypeUtil                = bugpack.require('TypeUtil');
    var PersistedCall           = bugpack.require('bugcall.PersistedCall');
    var PersistedCallFactory    = bugpack.require('bugcall.PersistedCallFactory');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestPersistedCallFactory", function(yarn) {
        yarn.wind({
            persistedCallFactory: new PersistedCallFactory()
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var persistedCallFactoryInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testPersistedCallFactory   = new PersistedCallFactory();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testPersistedCallFactory, PersistedCallFactory),
                "Assert testPersistedCallFactory is an instance of PersistedCallFactory");
        }
    };
    bugmeta.tag(persistedCallFactoryInstantiationTest).with(
        test().name("PersistedCallFactory - instantiation Test")
    );


    var persistedCallFactoryFactoryPersistedCallTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn                = bugyarn.yarn(this);
            yarn.spin([
                "setupTestPersistedCallFactory"
            ]);
            this.testCallType       = "testCallType";
            this.testCallUuid       = "testCallUuid";
            this.testReconnect      = false;
            this.testOpen           = false;
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var persistedCall = this.persistedCallFactory.factoryPersistedCall(this.testCallType, this.testCallUuid, this.testReconnect, this.testOpen);
            test.assertTrue(Class.doesExtend(persistedCall, PersistedCall),
                "Assert request returned a PersistedCall");
            test.assertEqual(persistedCall.getCallType(), this.testCallType,
                "Assert .callType was set correctly");
            test.assertEqual(persistedCall.getCallUuid(), this.testCallUuid,
                "Assert .callUuid was set correctly");
            test.assertEqual(persistedCall.getOpen(), this.testOpen,
                "Assert .open was set correctly");
            test.assertEqual(persistedCall.getReconnect(), this.testReconnect,
                "Assert .reconnect was set correctly");
        }
    };
    bugmeta.tag(persistedCallFactoryFactoryPersistedCallTest).with(
        test().name("PersistedCallFactory - #factoryPersistedCall Test")
    );
});
