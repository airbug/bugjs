//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugDouble           = bugpack.require('bugdouble.BugDouble');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var BugCallRouter       = bugpack.require('bugroute:bugcall.BugCallRouter');
var TestAnnotation      = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var spyOnFunction       = BugDouble.spyOnFunction;
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var bugCallRouterInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testBugCallRouter   = new BugCallRouter();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.testBugCallRouter.getRouteMap().isEmpty(),
            "Assert routeMap is empty");

    }
};
bugmeta.annotate(bugCallRouterInstantiationTest).with(
    test().name("BugCallRouter - instantiation Test")
);
