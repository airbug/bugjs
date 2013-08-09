//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('sharejs:server')

//@Export('ShareJsServerConfig')

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

var ShareJsServerConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getSockJs: function() {
        return this.properties.getProperty("sockjs");
    },

    /**
     * NOTE BRN: This expects the common sockjs config object
     * @param {Object} sockJs
     */
    setSockJs: function(sockJs) {
        this.properties.setProperty("sockjs", sockJs);
    },

    /**
     * @return {Object}
     */
    getDb: function() {
        return this.properties.getProperty("db");
    },

    /**
     * @param {Object} db
     */
    setDb: function(db) {
        this.properties.setProperty("db", db);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('sharejs:server.ShareJsServerConfig', ShareJsServerConfig);
