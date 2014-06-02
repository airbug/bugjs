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

//@Export('sharejs.ShareJsServerConfig')

//@Require('Class')
//@Require('Config')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack Modules
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Config          = bugpack.require('Config');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Config}
     */
    var ShareJsServerConfig = Class.extend(Config, {

        _name: "sharejs.ShareJsServerConfig",


        //-------------------------------------------------------------------------------
        // Public Methods
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

    bugpack.export('sharejs.ShareJsServerConfig', ShareJsServerConfig);
});
