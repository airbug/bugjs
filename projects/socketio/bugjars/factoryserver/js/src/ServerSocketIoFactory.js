//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:factoryserver')

//@Export('ServerSocketIoFactory')

//@Require('Class')
//@Require('Obj')
//@Require('socketio:client.ISocketFactory')
//@Require('socketio:socket.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var io      = require('socket.io-client');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var ISocketFactory      = bugpack.require('socketio:client.ISocketFactory');
var SocketIoConnection  = bugpack.require('socketio:socket.SocketIoConnection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ServerSocketIoFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // ISocketFactory Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {string} host
     * @param {{
        *     port: number,
     *     resource: string
     * }} options
     * @return {Socket}
     */
    createSocketConnection: function(host, options) {
        return new SocketIoConnection(io.connect(host, options), false);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(ServerSocketIoFactory, ISocketFactory);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("socketio:factoryserver.ServerSocketIoFactory", ServerSocketIoFactory);
