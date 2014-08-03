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

//@Export('bugcall.CallServer')
//@Autoload

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallServerConnection')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('socketio.SocketIoManager')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Event                   = bugpack.require('Event');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Set                     = bugpack.require('Set');
    var CallConnection          = bugpack.require('bugcall.CallConnection');
    var CallServerConnection    = bugpack.require('bugcall.CallServerConnection');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var SocketIoManager         = bugpack.require('socketio.SocketIoManager');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var CallServer = Class.extend(EventDispatcher, {

        _name: "bugcall.CallServer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {SocketIoManager} socketIoManager
         * @param {Marshaller} marshaller
         */
        _constructor: function(socketIoManager, marshaller) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<CallConnection>}
             */
            this.callConnectionSet      = new Set();

            /**
             * @private
             * @type {boolean}
             */
            this.initialized            = false;

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller             = marshaller;

            /**
             * @private
             * @type {SocketIoManager}
             */
            this.socketIoManager        = socketIoManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Marshaller}
         */
        getMarshaller: function() {
            return this.marshaller;
        },

        /**
         * @return {SocketIoManager}
         */
        getSocketIoManager: function() {
            return this.socketIoManager;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isInitialized: function() {
            return this.initialized;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            if (this.isInitialized()) {
                this.initialized = false;
                this.socketIoManager.removeEventListener(SocketIoManager.EventTypes.CONNECTION, this.hearManagerConnection, this);
                console.log("callServer deinitialized");
            }
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            if (!this.isInitialized()) {
                this.initialized = true;
                this.socketIoManager.addEventListener(SocketIoManager.EventTypes.CONNECTION, this.hearManagerConnection, this);
                console.log("callServer initialized");
            }
            callback();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {CallConnection} callConnection
         */
        addCallConnection: function(callConnection) {
            callConnection.addEventListener(CallConnection.EventTypes.CLOSED, this.hearConnectionClosed, this);
            this.callConnectionSet.add(callConnection);
        },

        /**
         * @private
         * @param {CallConnection} callConnection
         */
        removeCallConnection: function(callConnection) {
            this.callConnectionSet.remove(callConnection);
            callConnection.removeEventListener(CallConnection.EventTypes.CLOSED, this.hearConnectionClosed, this);
        },

        /**
         * @private
         * @param {CallConnection} callConnection
         * @param {boolean} failed
         */
        dispatchConnectionClosed: function(callConnection, failed) {
            this.dispatchEvent(new Event(CallServer.EventTypes.CONNECTION_CLOSED, {
                callConnection: callConnection,
                failed: failed
            }));
        },

        /**
         * @private
         * @param {CallConnection} callConnection
         */
        dispatchConnectionEstablished: function(callConnection) {
            this.dispatchEvent(new Event(CallServer.EventTypes.CONNECTION_ESTABLISHED, {
                callConnection: callConnection
            }));
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearManagerConnection: function(event) {
            var socketConnection = event.getData().socketConnection;
            var callConnection = new CallServerConnection(socketConnection, this.marshaller);
            this.addCallConnection(callConnection);
            this.dispatchConnectionEstablished(callConnection);
        },

        /**
         * @private
         * @param {Event} event
         */
        hearConnectionClosed: function(event) {
            var callConnection = event.getTarget();
            this.removeCallConnection(callConnection);
            this.dispatchConnectionClosed(callConnection, event.getData().failed);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @enum {string}
     */
    CallServer.EventTypes = {
        CONNECTION_CLOSED: "CallServer:ConnectionClosed",
        CONNECTION_ESTABLISHED: "CallServer:ConnectionEstablished"
    };


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(CallServer, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CallServer).with(
        module("callServer")
            .args([
                arg().ref("socketIoManager"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallServer', CallServer);
});
