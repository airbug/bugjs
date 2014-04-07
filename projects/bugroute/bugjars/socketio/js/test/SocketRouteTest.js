//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugroute:socketio.SocketRoute')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta             = bugpack.require('bugmeta.BugMeta');
var SocketRoute         = bugpack.require('bugroute:socketio.SocketRoute');
var TestAnnotation      = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var socketRouteInstantiationTest = {
    
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
bugmeta.annotate(socketRouteInstantiationTest).with(
    test().name("SocketRoute - instantiation Test")
);

