//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('sharejs:client')

//@Export('ShareJsClientConfig')

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

var ShareJsClientConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getAuthentication: function() {
        return this.properties.getProperty("authentication");
    },

    /**
     * @param {Object} authentication
     */
    setAuthentication: function(authentication) {
        this.properties.setProperty("authentication", authentication);
    },

    /**
     * @return {string}
     */
    getOrigin: function() {
        return this.properties.getProperty("origin");
    },

    /**
     * @param {string} origin
     */
    setOrigin: function(origin) {
        this.properties.setProperty("origin", origin);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('sharejs:client.ShareJsClientConfig', ShareJsClientConfig);
