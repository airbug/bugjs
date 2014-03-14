//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:server')

//@Export('SocketIoServerConfig')

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
 * @constructor
 * @extends {Config}
 */
var SocketIoServerConfig = Class.extend(Config, {

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

bugpack.export("socketio:server.SocketIoServerConfig", SocketIoServerConfig);
