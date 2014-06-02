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
//@Require('bugflow.BugFlow')
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
    var BugFlow             = bugpack.require('bugflow.BugFlow');
    var SocketIoConnection  = bugpack.require('socketio.SocketIoConnection');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series             = BugFlow.$series;
    var $task               = BugFlow.$task;


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
         * @param {SocketIoServer} socketIoServer
         * @param {string} namespace
         */
        _constructor: function(socketIoServer, namespace) {

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
            this.namespace          = namespace;

            /**
             * @private
             * @type {SocketIoServer}
             */
            this.socketIoServer     = socketIoServer;

            this.initialize();
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
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        initialize: function() {
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
