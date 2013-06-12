//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugroutes.SocketRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate            = bugpack.require('annotate.Annotate');
var SocketRoute         = bugpack.require('bugroutes.SocketRoute');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');

//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


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
annotate(constructorTest).with(
    test().name("SocketRoute ._constructor Test")
);

