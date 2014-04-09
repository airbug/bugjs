//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('redis.RedisConfig')

//@Require('Class')
//@Require('Config')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


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

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {number}
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
     * @returns {string}
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
