//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugroutes.SocketRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta             = bugpack.require('bugmeta.BugMeta');
var SocketRoute         = bugpack.require('bugroutes.SocketRoute');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');

//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var constructorTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.socketName = "mySocketRoute";
        this.listener = function(){
            
        };
        this.socketRoute = new SocketRoute(this.socketName, this.listener);

    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){
        var name            = this.socketRoute.name;
        var listener        = this.socketRoute.listener;

        test.assertEqual(this.socketName, "mySocketRoute",
            "Asserts that the socketRoute's name is assigned properly on construction");
        test.assertEqual(this.listener, this.listener,
            "Asserts that the socketRoute's listener is assigned properly on construction");
    }
};
bugmeta.annotate(constructorTest).with(
    test().name("SocketRoute ._constructor Test")
);

