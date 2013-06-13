//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:client')

//@Export('SocketIoConfig')

//@Require('Class')
//@Require('Config')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Config          = bugpack.require('Config');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getHost: function() {
        return this.properties.getProperty("host");
    },

    /**
     * @param {string} host
     */
    setHost: function(host) {
        this.properties.setProperty("host", host);
    },

    /**
     * @return {number}
     */
    getPort: function() {
        return this.properties.getProperty("port");
    },

    /**
     * @param {number} port
     */
    setPort: function(port) {
        this.properties.setProperty("port", port);
    },

    /**
     * @return {string}
     */
    getResource: function() {
        return this.properties.getProperty("resource");
    },

    /**
     * @param {string} resource
     */
    setResource: function(resource) {
        this.properties.setProperty("resource", resource);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("socketio:client.SocketIoConfig", SocketIoConfig);
