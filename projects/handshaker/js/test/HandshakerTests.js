//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('handshaker.DummyHand');
//@Require('handshaker.Handshaker')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil                = bugpack.require('TypeUtil');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var DummyHand               = bugpack.require('handshaker.DummyHand');
var Handshaker              = bugpack.require('handshaker.Handshaker');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


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
bugmeta.annotate(handshakerInstantiationTest).with(
    test().name("Handshaker - instantiation Test")
);


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
bugmeta.annotate(handshakerInstantiationWithHandsTest).with(
    test().name("Handshaker - instantiation with hands Test")
);

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
bugmeta.annotate(handshakerInstantiationWithNonHandsTest).with(
    test().name("Handshaker - instantiation with non hands Test")
);

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
bugmeta.annotate(handshakerShakeAuthorizedTrueWithThrowableShouldFailAuthorization).with(
    test().name("Handshaker - shake that returns true authorization but contains a throwable should fail authorization")
);
