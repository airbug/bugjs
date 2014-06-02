//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('configbug.Configbug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestTag  = bugpack.require('bugunit.TestTag');
var Configbug       = bugpack.require('configbug.Configbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------


/**
 * This tests...
 * 1) Instantiating a Configbug class with no parameters
 */
var configbugInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testConfigbug =   new Configbug();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testConfigbug, Configbug),
            "Assert testConfigbug extends Configbug");
        test.assertTrue(this.testConfigbug.getBuiltConfigMap().isEmpty(),
            "Assert testConfigbug.builtConfigMap starts empty");
    }
};
bugmeta.tag(configbugInstantiationTest).with(
    test().name("Configbug - instantiation test")
);
