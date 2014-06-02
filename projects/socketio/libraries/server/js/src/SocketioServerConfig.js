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

//@Export('socketio.SocketIoServerConfig')

//@Require('Class')
//@Require('Config')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Config      = bugpack.require('Config');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Config}
     */
    var SocketIoServerConfig = Class.extend(Config, {

        _name: "socketio.SocketIoServerConfig",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getMatchOriginProtocol: function() {
            var matchOriginProtocol = this.getProperties().getProperty("matchOriginProtocol");
            if (!TypeUtil.isBoolean(matchOriginProtocol)) {
                matchOriginProtocol = false;
            }
            return matchOriginProtocol;
        },

        /**
         * @param {boolean} matchOriginProtocol
         */
        setMatchOriginProtocol: function(matchOriginProtocol) {
            this.getProperties().setProperty("matchOriginProtocol", matchOriginProtocol);
        },

        /**
         * @return {string}
         */
        getResource: function() {
            var resource = this.getProperties().getProperty("resource");
            if (!TypeUtil.isString(resource)) {
                resource = "/socket.io"
            }
            return resource;
        },

        /**
         * @param {string} resource
         */
        setResource: function(resource) {
            this.getProperties().setProperty("resource", resource);
        },

        /**
         * @return {Array.<string>}
         */
        getTransports: function() {
            var transports = this.getProperties().getProperty("transports");
            if (!TypeUtil.isArray(transports)) {
                transports = [
                    'websocket',
                    'jsonp-polling'
                ];
            }
            return transports;
        },

        /**
         * @param {Array.<string>} transports
         */
        setTransports: function(transports) {
            this.getProperties().setProperty("transports", transports);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("socketio.SocketIoServerConfig", SocketIoServerConfig);
});
