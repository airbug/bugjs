//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.IocContext')
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
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var IocContext              = bugpack.require('bugioc.IocContext');
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

bugyarn.registerWinder("setupTestIocContext", function(yarn) {
    yarn.wind({
        iocContext: new IocContext()
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var iocContextInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testIocContext   = new IocContext();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testIocContext, IocContext),
            "Assert instance of IocContext");
    }
};

/**
 * This tests
 * 1) that the callback for initialize() is called when there are no configs
 */
var bugIocContextInitializeWithNoConfigurationsTest = {

    async: true,


    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.iocContext = new IocContext();
        test.completeSetup();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.iocContext.initialize(function() {
            test.assertTrue(true,
                "Assert iocContext.initialize() callback was successfully called when there's no configs");
            test.completeTest();
        })
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(iocContextInstantiationTest).with(
    test().name("IocContext - instantiation test")
);

bugmeta.annotate(bugIocContextInitializeWithNoConfigurationsTest).with(
    test().name("IocContext - initialize() with no configurations test")
);
