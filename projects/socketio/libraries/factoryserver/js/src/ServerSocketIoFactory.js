/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('socketio.ServerSocketIoFactory')

//@Require('Class')
//@Require('Obj')
//@Require('socketio.ISocketFactory')
//@Require('socketio.SocketIoConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var io                  = require('socket.io-client');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var ISocketFactory      = bugpack.require('socketio.ISocketFactory');
    var SocketIoConnection  = bugpack.require('socketio.SocketIoConnection');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ISocketFactory}
     */
    var ServerSocketIoFactory = Class.extend(Obj, {

        _name: "socketio.ServerSocketIoFactory",


        //-------------------------------------------------------------------------------
        // ISocketFactory Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {string} host
         * @param {{
            *     port: number,
         *     resource: string
         * }} options
         * @return {SocketIoConnection}
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

    bugpack.export("socketio.ServerSocketIoFactory", ServerSocketIoFactory);
});
