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

//@Export('socketio.BrowserSocketIoFactory')

//@Require('Class')
//@Require('Obj')
//@Require('socket-io.SocketIo')
//@Require('socketio.ISocketFactory')
//@Require('socketio.SocketIoConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var SocketIo            = bugpack.require('socket-io.SocketIo');
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
    var BrowserSocketIoFactory = Class.extend(Obj, {

        _name: "socketio.BrowserSocketIoFactory",


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
            return new SocketIoConnection(SocketIo.connect(host, options), false);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(BrowserSocketIoFactory, ISocketFactory);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("socketio.BrowserSocketIoFactory", BrowserSocketIoFactory);
});
