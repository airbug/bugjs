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
//@Require('bugcall.CallManager')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var CallManager     = bugpack.require('bugcall.CallManager');
    var BugDouble       = bugpack.require('bugdouble.BugDouble');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');
    var BugYarn         = bugpack.require('bugyarn.BugYarn');
    var Logger          = bugpack.require('loggerbug.Logger');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var bugyarn         = BugYarn.context();
    var spyOnObject     = BugDouble.spyOnObject;
    var stubObject      = BugDouble.stubObject;
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestCallManager", function(yarn) {
        yarn.spin([
            "setupTestLogger",
            "setupTestPersistedCallFactory",
            "setupDummyRedisClient"
        ]);
        yarn.wind({
            callManager: new CallManager(this.logger, this.redisClient, this.persistedCallFactory)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var callManagerInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger",
                "setupTestPersistedCallFactory",
                "setupDummyRedisClient"
            ]);
            this.testCallManager = new CallManager(this.logger, this.redisClient, this.persistedCallFactory);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCallManager, CallManager),
                "Assert instance of CallManager");
            test.assertEqual(this.testCallManager.getLogger(), this.logger,
                "Assert .logger was set correctly");
            test.assertEqual(this.testCallManager.getRedisClient(), this.redisClient,
                "Assert .redisClient was set correctly");
            test.assertEqual(this.testCallManager.getPersistedCallFactory(), this.persistedCallFactory,
                "Assert .persistedCallFactory was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(callManagerInstantiationTest).with(
        test().name("CallManager - instantiation Test")
    );
});
