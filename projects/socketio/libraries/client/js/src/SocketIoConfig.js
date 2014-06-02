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

//@Export('socketio.SocketIoConfig')

//@Require('Class')
//@Require('Config')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Config  = bugpack.require('Config');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Config}
     */
    var SocketIoConfig = Class.extend(Config, {

        _name: "socketio.SocketIoConfig",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getHost: function() {
            return this.getProperties().getProperty("host");
        },

        /**
         * @param {string} host
         */
        setHost: function(host) {
            this.getProperties().setProperty("host", host);
        },

        /**
         * @return {number}
         */
        getPort: function() {
            return this.getProperties().getProperty("port");
        },

        /**
         * @param {number} port
         */
        setPort: function(port) {
            this.getProperties().setProperty("port", port);
        },

        /**
         * @return {string}
         */
        getResource: function() {
            return this.getProperties().getProperty("resource");
        },

        /**
         * @param {string} resource
         */
        setResource: function(resource) {
            this.getProperties().setProperty("resource", resource);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("socketio.SocketIoConfig", SocketIoConfig);
});
