//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:factoryserver')

//@Export('ServerSocketIoFactory')

//@Require('Class')
//@Require('Obj')
//@Require('socket-io.SocketIo')
//@Require('socketio:client.ISocketFactory')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var io      = require('socket.io-client');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var ISocketFactory  = bugpack.require('socketio:client.ISocketFactory');


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
    generateSocket: function(host, options) {
        return io.connect(host, options);
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
