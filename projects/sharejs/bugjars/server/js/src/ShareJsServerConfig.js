//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('sharejs:server.ShareJsServerConfig')

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
var ShareJsServerConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getSockJs: function() {
        return this.getProperties().getProperty("sockjs");
    },

    /**
     * NOTE BRN: This expects the common sockjs config object
     * @param {Object} sockJs
     */
    setSockJs: function(sockJs) {
        this.getProperties().setProperty("sockjs", sockJs);
    },

    /**
     * @return {Object}
     */
    getDb: function() {
        return this.getProperties().getProperty("db");
    },

    /**
     * @param {Object} db
     */
    setDb: function(db) {
        this.getProperties().setProperty("db", db);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('sharejs:server.ShareJsServerConfig', ShareJsServerConfig);
