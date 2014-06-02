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

//@Export('sharejs.ShareJsClientConfig')

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
    var ShareJsClientConfig = Class.extend(Config, {

        _name: "sharejs.ShareJsClientConfig",


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

    bugpack.export('sharejs.ShareJsClientConfig', ShareJsClientConfig);
});
