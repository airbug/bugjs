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

//@Export('redis.RedisConfig')

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
    var RedisConfig = Class.extend(Config, {

        _name: "redis.RedisConfig",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getPort: function() {
            var port = this.getProperty("port");
            if (!TypeUtil.isNumber(port)) {
                port = 6379;
            }
            return port;
        },

        /**
         * @param {number} port
         */
        setPort: function(port) {
            this.setProperty("port", port);
        },

        /**
         * @return {string}
         */
        getHost: function() {
            var host = this.getProperty("host");
            if (!TypeUtil.isString(host)) {
                host = "127.0.0.1";
            }
            return host;
        },

        /**
         * @param {string} host
         */
        setHost: function(host) {
            this.setProperty("host", host);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("redis.RedisConfig", RedisConfig);
});
