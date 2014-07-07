/*
 * Copyright (c) 2014 carapace Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of carapace Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('carapace.WindowUtil')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var WindowUtil = Class.extend(Obj, {

        _name: "carapace.WindowUtil",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {window|*|window.window} window
         */
        _constructor: function(window) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {window|*|window.window}
             */
            this.window = window;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {window|*|window.window}
         */
        getWindow: function() {
            return this.window;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        // If URL is http://www.somedomain.com:8000/account/search?filter=a#top

        /**
         * http://www.somedomain.com:8000
         * @return {string}
         */
        getBaseUrl: function() {
            var protocol    = this.getProtocol();
            var host        = this.getHost();
            return protocol + "//" + host;
        },

        /**
         * http://www.somedomain.com:8000/account/search
         * @return {string}
         */
        getUrl: function() {
            var protocol    = this.getProtocol();
            var host        = this.getHost();
            var pathname    = this.getPathname();
            return protocol + "//" + host + pathname;
        },

        /**
         * #top
         * @return {string}
         */
        getHash: function() {
            return this.window.location.hash;
        },

        /**
         * www.somedomain.com:8000
         * @return {string}
         */
        getHost: function() {
            return this.window.location.host;
        },

        /**
         * www.somedomain.com
         * @return {string}
         */
        getHostname: function() {
            return this.window.location.hostname;
        },

        /**
         * http://www.somedomain.com:8000/account/search?filter=a#top
         * @return {string}
         */
        getHref: function() {
            return this.window.location.href.toString();
        },

        /**
         * /account/search
         * @returns {string}
         */
        getPathname: function() {
            return window.location.pathname;
        },

        /**
         * 8000
         * @returns {number}
         */
        getPort: function() {
            var windowPort  = window.location.port;
            var port        = 80;
            if (windowPort !== "") {
                port = (windowPort - 0);
            }
            return port;
        },

        /**
         * http:
         * @return {string}
         */
        getProtocol: function() {
            return this.window.location.protocol;
        },

        /**
         * ?filter=a
         * @return {string}
         */
        getQuery: function() {
            return this.window.location.search;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.WindowUtil", WindowUtil);
});
