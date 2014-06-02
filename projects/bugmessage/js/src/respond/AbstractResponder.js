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

//@Export('bugmessage.AbstractResponder')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('bugmessage.IResponder')
//@Require('bugmessage.Response')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var TypeUtil        = bugpack.require('TypeUtil');
    var UuidGenerator   = bugpack.require('UuidGenerator');
    var IResponder      = bugpack.require('bugmessage.IResponder');
    var Response        = bugpack.require('bugmessage.Response');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var AbstractResponder = Class.extend(Obj, {

        _name: "bugmessage.AbstractResponder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        _constructor: function(responseChannel) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.closed = false;

            /**
             * @private
             * @type {IResponseChannel}
             */
            this.responseChannel = responseChannel;

            this.responseChannel.addEventPropagator(this);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IResponseChannel}
         */
        getResponseChannel: function() {
            return this.responseChannel;
        },

        /**
         * @return {boolean}
         */
        isClosed: function() {
            return this.closed;
        },


        //-------------------------------------------------------------------------------
        // IResponder Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        close: function() {
            if (!this.isClosed()) {
                this.responseChannel.closeChannel();
                this.responseChannel.removeEventPropagator(this);
                this.responseChannel = null;
            }
        },

        //doSendResponse: function(response, callback) {},

        /**
         * @param {Response} response
         * @param {function(Error)} callback
         */
        sendResponse: function(response, callback) {
            if (!this.isClosed()) {
                try {
                    this.doSendResponse(response, callback);
                    callback();
                } catch (error) {
                    callback(error);
                }
            } else {
                callback(new Error("Cannot send a response after the responder is closed"));
            }
        },


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Object} data
         * @param {function(Error)} callback
         */
        respond: function(data, callback) {
            var response = new Response(data);
            this.sendResponse(response, callback);
        },

        /**
         * @return {Object}
         */
        toObject: function() {
            return {
                responseChannel: this.responseChannel.toObject()
            };
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AbstractResponder, IResponder);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugmessage.AbstractResponder', AbstractResponder);
});
