//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var Logger                  = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestLogger", function(yarn) {
    yarn.wind({
        logger: new Logger(console)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var loggerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testConsole            = {};
        this.testConsoleLogPriority = Logger.Priority.DEBUG;
        this.testLogger             = new Logger(this.testConsole, this.testConsoleLogPriority);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testLogger, Logger),
            "Assert testLogger does extend Logger");
        test.assertEqual(this.testLogger.getConsole(), this.testConsole,
            "Assert .console was set correctly");
        test.assertEqual(this.testLogger.getConsoleLogPriority(), this.testConsoleLogPriority,
            "Assert .consoleLogPriority was set correctly");
    }
};
bugmeta.annotate(loggerInstantiationTest).with(
    test().name("Logger - instantiation Test")
);
