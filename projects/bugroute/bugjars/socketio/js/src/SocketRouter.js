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

//@Export('bugroute.SocketRouter')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('socketio.SocketIoManager')
//@Require('socketio.SocketIoConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');
    var SocketIoManager     = bugpack.require('socketio.SocketIoManager');
    var SocketIoConnection  = bugpack.require('socketio.SocketIoConnection');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var SocketRouter = Class.extend(Obj, {

        _name: "bugroute.SocketRouter",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {SocketIoManager} ioManager
         */
        _constructor: function(ioManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {SocketIoManager}
             */
            this.ioManager = ioManager;

            /**
             * @private
             * @type {Map.<string, SocketRoute>}
             */
            this.routesMap = new Map();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable)} callback
         */
        initialize: function(callback){
            if(!callback || typeof callback !== 'function') var callback = function(){};

            var _this = this;
            this.ioManager.on(SocketIoManager.EventTypes.CONNECTION, function(event){
                /** @type {SocketIoConnection} */
                var socketConnection = event.getData().socketConnection;
                socketConnection.on(SocketIoConnection.EventTypes.DISCONNECT, this.handleConnectionDisconnect, this);
                socketConnection.on(SocketIoConnection.EventTypes.MESSAGE, this.handleConnectionMessage, this);
            });

            callback(undefined);
        },

        /**
         * @param {SocketRoute} route
         */
        add: function(route) {
            var messageType = route.getMessageType();
            if (!this.routesMap.containsKey(messageType)) {
                this.routesMap.put(messageType, route);
            } else {
                throw new Error("The messageType " + messageType + " already exists in the routesMap");
            }
        },

        /**
         * @param {Array.<SocketRoute>} routes
         */
        addAll: function(routes) {
            var _this = this;
            if (TypeUtil.isArray(routes)) {
                routes.forEach(function(route) {
                    _this.add(route);
                });
            }  else {
                throw new Error("Expects array of SocketRoutes");
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        handleConnectionDisconnect: function(event) {
            var socketConnection = event.getTarget();
            socketConnection.removeEventListener(SocketIoConnection.EventTypes.DISCONNECT, this.handleConnectionDisconnect, this);
            socketConnection.removeEventListener(SocketIoConnection.EventTypes.MESSAGE, this.handleConnectionMessage, this);
        },

        /**
         * @private
         * @param {Event} event
         */
        handleConnectionMessage: function(event) {
            var message     = event.getData().message;
            var socket      = event.getTarget();
            var messageType = message.type;
            if (messageType) {
                var socketRoute = this.routesMap.get(messageType);
                if (socketRoute) {
                    socketRoute.route(socket, message);
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugroute.SocketRouter', SocketRouter);
});
