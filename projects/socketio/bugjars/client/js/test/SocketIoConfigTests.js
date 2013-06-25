//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('socketio:client.SocketIoConfig')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate            = bugpack.require('annotate.Annotate');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');
var SocketIoConfig      = bugpack.require('socketio:client.SocketIoConfig');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------


var socketIoConfigConstructorTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.socketIoConfig1 = new SocketIoConfig({});
        this.socketIoConfig2 = new SocketIoConfig({
            host: "test host",
            port: 8080,
            resource: "/someresource"
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.socketIoConfig1.getHost(), null,
            "Assert ");
    }
};
annotate(socketIoConfigConstructorTest).with(
    test().name("SocketIoConfig constructor Test")
);


var socketIoConfigGetSetTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.socketIoConfig = new SocketIoConfig({});
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {

    }
};
annotate(socketIoConfigGetSetTest).with(
    test().name("SocketIoConfig get and set Test")
);