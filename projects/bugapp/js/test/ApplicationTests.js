//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugapp.Application')
//@Require('bugdouble.BugDouble')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Application                         = bugpack.require('bugapp.Application');
var BugDouble                           = bugpack.require('bugdouble.BugDouble');
var ConfigurationAnnotationProcessor    = bugpack.require('bugioc.ConfigurationAnnotationProcessor');
var ConfigurationScan                   = bugpack.require('bugioc.ConfigurationScan');
var IocContext                          = bugpack.require('bugioc.IocContext');
var ModuleAnnotationProcessor           = bugpack.require('bugioc.ModuleAnnotationProcessor');
var ModuleScan                          = bugpack.require('bugioc.ModuleScan');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                      = bugpack.require('bugunit.TestAnnotation');
var BugYarn                             = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                             = BugMeta.context();
var bugyarn                             = BugYarn.context();
var stubObject                          = BugDouble.stubObject;
var test                                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestApplication", function(yarn) {
    yarn.wind({
        application: new Application()
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var applicationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testApplication    = new Application();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testApplication, Application),
            "Assert instance of Application");
        test.assertEqual(this.testApplication.getState(), Application.States.STOPPED,
            "Assert .state defaults to Application.States.STOPPED");
        test.assertTrue(Class.doesExtend(this.testApplication.getConfigurationScan(), ConfigurationScan),
            "Assert .configurationScan is an instance of ConfigurationScan");
        test.assertTrue(Class.doesExtend(this.testApplication.getIocContext(), IocContext),
            "Assert .iocContext is an instance of IocContext");
        test.assertTrue(Class.doesExtend(this.testApplication.getModuleScan(), ModuleScan),
            "Assert .moduleScan is an instance of ModuleScan");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(applicationInstantiationTest).with(
    test().name("Application - instantiation test")
);
