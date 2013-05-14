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

var enableTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var routeName       = "testRoute";
        var listener        = function(){};
        this.socketRoute    = new SocketRoute(routeName, listener);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){
        var socket          = {
            on: function(){ 
                this.called = true;
            }
        };
        this.socketRoute.enable(socket);

        test.assertEqual(socket.called, true, 
            "Asserts that SocketRoute #enable calls the socket #on function")
    }
};
annotate(enableTest).with(
    test().name("SocketRoute #enable Test")
);
