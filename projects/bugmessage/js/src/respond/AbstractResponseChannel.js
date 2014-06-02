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

//@Export('bugmessage.AbstractResponseChannel')

//@Require('Class')
//@Require('EventPropagator')
//@Require('UuidGenerator')
//@Require('bugmessage.IResponseChannel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventPropagator     = bugpack.require('EventPropagator');
    var UuidGenerator       = bugpack.require('UuidGenerator');
    var IResponseChannel    = bugpack.require('bugmessage.IResponseChannel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventPropagator}
     */
    var AbstractResponseChannel = Class.extend(EventPropagator, {

        _name: "bugmessage.AbstractResponseChannel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.closed = false;

            //TODO BRN: Uuid of channel should be consistent through out the entire channel/receiver chain
            /**
             * @private
             * @type {string}
             */
            this.uuid = UuidGenerator.generateUuid();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getUuid: function() {
            return this.uuid;
        },

        /**
         * @return {boolean}
         */
        isClosed: function() {
            return this.closed;
        },


        /**
         * @abstract
         * @param {Response} response
         */
        //doChannelResponse: function(response) {},

        /**
         * @abstract
         */
        //doCloseChannel: function() {},


        //-------------------------------------------------------------------------------
        // IMessageChannel Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Response} response
         */
        channelResponse: function(response) {
            if (!this.isClosed()) {
                this.doChannelResponse(response);
            } else {
                throw new Error("Cannot channel a response after channel is closed");
            }
        },

        /**
         *
         */
        closeChannel: function() {
            if (!this.isClosed()) {
                this.doCloseChannel();
            }
        },


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        toObject: function() {
            return {
                uuid: this.uuid
            };
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AbstractResponseChannel, IResponseChannel);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.AbstractResponseChannel', AbstractResponseChannel);
});
