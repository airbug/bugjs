//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('socketio:client.SocketIoConfig')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestTag  = bugpack.require('bugunit.TestTag');
var SocketIoConfig  = bugpack.require('socketio:client.SocketIoConfig');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestTag.test;


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
bugmeta.tag(socketIoConfigConstructorTest).with(
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
bugmeta.tag(socketIoConfigGetSetTest).with(
    test().name("SocketIoConfig get and set Test")
);