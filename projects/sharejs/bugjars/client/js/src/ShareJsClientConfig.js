//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('sharejs:client.ShareJsClientConfig')

//@Require('Class')
//@Require('Config')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
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
var ShareJsClientConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getAuthentication: function() {
        return this.getProperties().getProperty("authentication");
    },

    /**
     * @param {Object} authentication
     */
    setAuthentication: function(authentication) {
        this.getProperties().setProperty("authentication", authentication);
    },

    /**
     * @return {string}
     */
    getOrigin: function() {
        return this.getProperties().getProperty("origin");
    },

    /**
     * @param {string} origin
     */
    setOrigin: function(origin) {
        this.getProperties().setProperty("origin", origin);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('sharejs:client.ShareJsClientConfig', ShareJsClientConfig);
