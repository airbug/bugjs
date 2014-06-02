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
//@Require('bugsub.PubSub')
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
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var PubSub                  = bugpack.require('bugsub.PubSub');
    var TestTag          = bugpack.require('bugunit.TestTag');
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

    bugyarn.registerWinder("setupTestPubSub", function(yarn) {
        yarn.spin([
            "setupTestLogger",
            "setupTestMarshaller",
            "setupTestRedisPubSub"
        ]);
        yarn.wind({
            pubSub: new PubSub(this.logger, this.marshaller, this.redisPubSub)
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var pubSubInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestLogger",
                "setupTestMarshaller",
                "setupTestRedisPubSub"
            ]);
            this.testPubSub     = new PubSub(this.logger, this.marshaller, this.redisPubSub);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testPubSub, PubSub),
                "Assert instance of PubSub");
            test.assertEqual(this.testPubSub.getLogger(), this.logger,
                "Assert .logger was set correctly");
            test.assertEqual(this.testPubSub.getMarshaller(), this.marshaller,
                "Assert .marshaller was set correctly");
            test.assertEqual(this.testPubSub.getRedisPubSub(), this.redisPubSub,
                "Assert .redisPubSub was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(pubSubInstantiationTest).with(
        test().name("PubSub - instantiation test")
    );
});
