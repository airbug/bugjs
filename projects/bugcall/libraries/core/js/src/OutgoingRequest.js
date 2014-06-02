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

//@Export('bugcall.OutgoingRequest')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.RequestEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var RequestEvent        = bugpack.require('bugcall.RequestEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var OutgoingRequest = Class.extend(EventDispatcher, {

        _name: "bugcall.OutgoingRequest",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CallRequest} callRequest
         */
        _constructor: function(callRequest) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CallRequest}
             */
            this.callRequest        = callRequest;

            /**
             * @private
             * @type {OutgoingRequest.State}
             */
            this.state             = OutgoingRequest.State.READY;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CallRequest}
         */
        getCallRequest: function() {
            return this.callRequest;
        },

        /**
         * @return {OutgoingRequest.State}
         */
        getState: function() {
            return this.state;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getUuid: function() {
            return this.callRequest.getUuid();
        },

        /**
         * @return {boolean}
         */
        isQueued: function() {
            return this.state === OutgoingRequest.State.QUEUED;
        },

        /**
         * @return {boolean}
         */
        isReady: function() {
            return this.state === OutgoingRequest.State.READY;
        },

        /**
         * @return {boolean}
         */
        isSent: function() {
            return this.state === OutgoingRequest.State.SENT;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        changeStateQueued: function() {
            if (!this.isQueued()) {
                this.state = OutgoingRequest.State.QUEUED;
                this.dispatchEvent(new RequestEvent(RequestEvent.Types.QUEUED));
            }
        },

        /**
         *
         */
        changeStateSent: function() {
            if (!this.isSent()) {
                this.state = OutgoingRequest.State.SENT;
                this.dispatchEvent(new RequestEvent(RequestEvent.Types.SENT));
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    OutgoingRequest.State = {
        READY: "OutgoingRequest:State:Ready",
        QUEUED: "OutgoingRequest:State:Queued",
        SENT: "OutgoingRequest:State:Sent"
    };


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.OutgoingRequest', OutgoingRequest);
});
