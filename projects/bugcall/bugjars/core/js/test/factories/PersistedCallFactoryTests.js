//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugcall.PersistedCall')
//@Require('bugcall.PersistedCallFactory')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var TypeUtil                = bugpack.require('TypeUtil');
var PersistedCall           = bugpack.require('bugcall.PersistedCall');
var PersistedCallFactory    = bugpack.require('bugcall.PersistedCallFactory');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


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
bugmeta.annotate(persistedCallFactoryInstantiationTest).with(
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
        this.testCallUuid       = "testCallUuid";
        this.testReconnect      = false;
        this.testOpen           = false;
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var persistedCall = this.persistedCallFactory.factoryPersistedCall(this.testCallUuid, this.testReconnect, this.testOpen);
        test.assertTrue(Class.doesExtend(persistedCall, PersistedCall),
            "Assert request returned a PersistedCall");
        test.assertEqual(persistedCall.getCallUuid(), this.testCallUuid,
            "Assert .callUuid was set correctly");
        test.assertEqual(persistedCall.getOpen(), this.testOpen,
            "Assert .open was set correctly");
        test.assertEqual(persistedCall.getReconnect(), this.testReconnect,
            "Assert .reconnect was set correctly");
    }
};
bugmeta.annotate(persistedCallFactoryFactoryPersistedCallTest).with(
    test().name("PersistedCallFactory - #factoryPersistedCall Test")
);
