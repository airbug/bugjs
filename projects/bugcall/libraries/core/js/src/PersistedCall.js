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

//@Export('bugcall.PersistedCall')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PersistedCall = Class.extend(Obj, {

        _name: "bugcall.PersistedCall",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} callType
         * @param {string} callUuid
         * @param {boolean} reconnect
         * @param {boolean} open
         */
        _constructor: function(callType, callUuid, reconnect, open) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.callType                           = callType || "client";

            /**
             * @private
             * @type {string}
             */
            this.callUuid                           = callUuid || "";

            /**
             * @private
             * @type {boolean}
             */
            this.open                               = open || false;

            /**
             * @private
             * @type {boolean}
             */
            this.reconnect                          = reconnect || false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getCallUuid: function() {
            return this.callUuid;
        },

        /**
         * @param {string} callUuid
         */
        setCallUuid: function(callUuid) {
            this.callUuid = callUuid;
        },

        /**
         * @return {string}
         */
        getCallType: function() {
            return this.callType;
        },

        /**
         * @param {string} callType
         */
        setCallType: function(callType) {
            this.callType = callType;
        },

        /**
         * @return {boolean}
         */
        getOpen: function() {
            return this.open;
        },

        /**
         * @param {boolean} open
         */
        setOpen: function(open) {
            this.open = open;
        },

        /**
         * @return {boolean}
         */
        isOpen: function() {
            return this.open;
        },

        /**
         * @return {boolean}
         */
        getReconnect: function() {
            return this.open;
        },

        /**
         * @param {boolean} reconnect
         */
        setReconnect: function(reconnect) {
            this.reconnect = reconnect;
        },

        /**
         * @return {boolean}
         */
        isReconnect: function() {
            return this.reconnect;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.PersistedCall', PersistedCall);
});
