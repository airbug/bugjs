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

//@Export('bugroute.SocketRoute')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var SocketRoute = Class.extend(Obj, {

        _name: "bugroute.SocketRoute",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} messageType
         * @param {function(SocketIoConnection, Object, function(Throwable))} listener
         */
        _constructor: function(messageType, listener) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(SocketIoConnection, Object, function(Throwable))}
             */
            this.listener       = listener;

            /**
             * @private
             * @type {string}
             */
            this.messageType    = messageType;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(...)}
         */
        getListener: function() {
            return this.listener;
        },

        /**
         * @return {string}
         */
        getMessageType: function() {
            return this.messageType;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {SocketIoConnection} socket
         * @param {Object} message
         * @param {function(Throwable)} callback
         */
        route: function(socket, message, callback) {
            this.listener.call(null, socket, message, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugroute.SocketRoute', SocketRoute);
});
