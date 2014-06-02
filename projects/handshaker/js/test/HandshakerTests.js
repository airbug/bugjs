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

//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('handshaker.DummyHand');
//@Require('handshaker.Handshaker')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var TypeUtil    = bugpack.require('TypeUtil');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');
    var BugYarn     = bugpack.require('bugyarn.BugYarn');
    var DummyHand   = bugpack.require('handshaker.DummyHand');
    var Handshaker  = bugpack.require('handshaker.Handshaker');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var bugyarn     = BugYarn.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestHandshaker", function(yarn) {
        yarn.wind({
            handshaker: new Handshaker()
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var handshakerInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testHandshaker     = new Handshaker();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testHandshaker.getHandCount(), 0,
                "Assert no hands have been registered for testHandshaker");
        }
    };

    var handshakerInstantiationWithHandsTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testDummyHand      = new DummyHand(true, undefined);
            this.testHandshaker     = new Handshaker([this.testDummyHand]);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testHandshaker.getHandCount(), 1,
                "Assert 1 hand has been registered for testHandshaker");
            test.assertTrue(this.testHandshaker.hasHand(this.testDummyHand),
                "Assert the Handshaker has the testDummyHand");
        }
    };

    var handshakerInstantiationWithNonHandsTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testNonHand        = {};
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertThrows(function() {
                var testHandshaker     = new Handshaker([_this.testNonHand]);
            });
        }
    };

    var handshakerShakeAuthorizedTrueWithThrowableShouldFailAuthorization = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testHandShakeData  = {};
            this.testError          = new Error("test error");
            this.testDummyHand      = new DummyHand(true, this.testError);
            this.testHandshaker     = new Handshaker([this.testDummyHand]);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testHandshaker.shake(this.testHandShakeData, function(throwable, authorized) {
                test.assertEqual(authorized, false,
                    "Assert authorized is false due to the Error in the hand");
                test.assertEqual(throwable, _this.testError,
                    "Assert the throwable returned was the testError");
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(handshakerInstantiationTest).with(
        test().name("Handshaker - instantiation Test")
    );
    bugmeta.tag(handshakerInstantiationWithHandsTest).with(
        test().name("Handshaker - instantiation with hands Test")
    );
    bugmeta.tag(handshakerInstantiationWithNonHandsTest).with(
        test().name("Handshaker - instantiation with non hands Test")
    );
    bugmeta.tag(handshakerShakeAuthorizedTrueWithThrowableShouldFailAuthorization).with(
        test().name("Handshaker - shake that returns true authorization but contains a throwable should fail authorization")
    );
});
