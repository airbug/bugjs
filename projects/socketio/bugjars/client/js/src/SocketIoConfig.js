//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('socketio:client.SocketIoConfig')

//@Require('Class')
//@Require('Config')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Config          = bugpack.require('Config');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Config}
 */
var SocketIoConfig = Class.extend(Config, {

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

bugpack.export("socketio:client.SocketIoConfig", SocketIoConfig);
