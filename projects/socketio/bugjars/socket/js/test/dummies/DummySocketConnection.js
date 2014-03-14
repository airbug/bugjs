//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:socket')

//@Export('DummySocketConnection')

//@Require('ArgUtil')
//@Require('Class')
//@Require('EventReceiver')
//@Require('Map')
//@Require('NodeJsEvent')
//@Require('TypeUtil')
//@Require('socketio:socket.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil                 = bugpack.require('ArgUtil');
var Class                   = bugpack.require('Class');
var EventReceiver           = bugpack.require('EventReceiver');
var Map                     = bugpack.require('Map');
var NodeJsEvent             = bugpack.require('NodeJsEvent');
var TypeUtil                = bugpack.require('TypeUtil');
var SocketIoConnection      = bugpack.require('socketio:socket.SocketIoConnection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DummySocketConnection = Class.extend(SocketIoConnection, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(connected) {
        var dummySocket = {
            addListener: function() {},
            emit: function() {},
            removeListener: function() {}
        };
        this._super(dummySocket, connected);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('socketio:socket.DummySocketConnection', DummySocketConnection);
