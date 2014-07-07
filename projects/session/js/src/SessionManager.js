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

//@Export('session.SessionManager')

//@Require('Class')
//@Require('Obj')
//@Require('session.Session')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var Session     = bugpack.require('session.Session');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var SessionManager = Class.extend(Obj, {

        _name: "session.SessionManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Cookies} cookies
         */
        _constructor: function(cookies) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Cookies}
             */
            this.cookies = cookies;

            /**
             * @private
             * @type {Session}
             */
            this.currentSession = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {Session}
         */
        getCurrentSession: function() {
            return this.currentSession;
        },


        //-------------------------------------------------------------------------------
        // Public Class Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} siteKey
         */
        establishSession: function(siteKey) {
            var sessionInCookies = this.retrieveSessionFromCookies(siteKey);
            if (sessionInCookies) {
                this.currentSession = sessionInCookies;
            } else {
                this.currentSession = this.generateSession(siteKey);
                this.storeSessionToCookies(siteKey, this.currentSession);
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {Session}
         */
        generateSession: function() {
            return new Session();
        },

        /**
         * @private
         * @param {string} siteKey
         * @return {Session}
         */
        retrieveSessionFromCookies: function(siteKey) {
            var sessionObject = this.cookies.getCookie(siteKey + "-session");
            if (sessionObject) {
                //TODO BRN: This should actually be done by BugMarshaller
                return new Session(JSON.parse(sessionObject));
            }
            return null;
        },

        /**
         * @private
         * @param {Session} session
         */
        storeSessionToCookies: function(siteKey, session) {
            var sessionObject = session.toObject();
            this.cookies.setCookie(siteKey + "-session", JSON.stringify(sessionObject), Infinity, "/");
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('session.SessionManager', SessionManager);
});
