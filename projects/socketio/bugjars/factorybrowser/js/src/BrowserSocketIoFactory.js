//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:client')

//@Export('BrowserSocketIoFactory')

//@Require('Class')
//@Require('Obj')
//@Require('socket-io.SocketIo')
//@Require('socketio:browserfactory.ISocketFactory')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var SocketIo        = bugpack.require('socket-io.SocketIo');
var ISocketFactory  = bugpack.require('socketio:browserfactory.ISocketFactory');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BrowserSocketIoFactory = Class.extend(Obj, {

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
        return SocketIo.connect(host, options);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(BrowserSocketIoFactory, ISocketFactory);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("socketio:browserfactory.BrowserSocketIoFactory", BrowserSocketIoFactory);
