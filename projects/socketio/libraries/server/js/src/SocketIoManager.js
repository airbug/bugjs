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

//@Export('socketio.SocketIoManager')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('socketio.SocketIoConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var io                  = require('socket.io');


    //-------------------------------------------------------------------------------
    // BugPack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var SocketIoConnection  = bugpack.require('socketio.SocketIoConnection');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var SocketIoManager = Class.extend(EventDispatcher, {

        _name: "socketio.SocketIoManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.ioManager          = null;

            /**
             * @private
             * @type {string}
             */
            this.namespace          = "";

            /**
             * @private
             * @type {SocketIoServer}
             */
            this.socketIoServer     = null;
        },


        //-------------------------------------------------------------------------------
        // Initializer
        //-------------------------------------------------------------------------------

        /**
         * @param {SocketIoServer} socketIoServer
         * @param {string} namespace
         */
        init: function(socketIoServer, namespace) {
            this._super();
            this.namespace = namespace;
            this.socketIoServer = socketIoServer;
            this.ioManager = this.socketIoServer.of(this.namespace);
            console.log("Inside SocketIoManager#initialize");
            var _this = this;
            this.ioManager.on("connection", function(socket) {
                console.log("Inside SocketIoManager ioManager.on 'connection' callback");
                var socketConnection = new SocketIoConnection(socket, true);

                console.log("socketConnection:", !!socketConnection);

                _this.dispatchEvent(new Event(SocketIoManager.EventTypes.CONNECTION, {
                    socketConnection: socketConnection
                }));
            });
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getNamespace: function() {
            return this.namespace;
        },

        /**
         * @return {SocketIoServer}
         */
        getSocketIoServer: function() {
            return this.socketIoServer;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    SocketIoManager.EventTypes = {
        CONNECTION: "SocketIoManager:Connection"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('socketio.SocketIoManager', SocketIoManager);
});
