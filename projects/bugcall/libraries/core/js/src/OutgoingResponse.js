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

//@Export('bugcall.OutgoingResponse')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('IObjectable')
//@Require('bugcall.ResponseEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var IObjectable         = bugpack.require('IObjectable');
var ResponseEvent       = bugpack.require('bugcall.ResponseEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EventDispatcher}
 * @implements {IObjectable}
 */
var OutgoingResponse = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {CallResponse} callResponse
     */
    _constructor: function(callResponse) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallResponse}
         */
        this.callResponse       = callResponse;

        /**
         * @private
         * @type {OutgoingResponse.State}
         */
        this.state             = OutgoingResponse.State.READY;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallResponse}
     */
    getCallResponse: function() {
        return this.callResponse;
    },

    /**
     * @return {OutgoingResponse.State}
     */
    getState: function() {
        return this.state;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function() {
        return this.callResponse.getData();
    },

    /**
     * @return {string}
     */
    getRequestUuid: function() {
        return this.callResponse.getRequestUuid()
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.callResponse.getType();
    },

    /**
     * @return {string}
     */
    getUuid: function() {
        return this.callResponse.getUuid();
    },

    /**
     * @return {boolean}
     */
    isQueued: function() {
        return this.state === OutgoingResponse.State.QUEUED;
    },

    /**
     * @return {boolean}
     */
    isReady: function() {
        return this.state === OutgoingResponse.State.READY;
    },

    /**
     * @return {boolean}
     */
    isSent: function() {
        return this.state === OutgoingResponse.State.SENT;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return this.callResponse.toObject();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    changeStateQueued: function() {
        if (!this.isQueued()) {
            this.state = OutgoingResponse.State.QUEUED;
            this.dispatchEvent(new ResponseEvent(ResponseEvent.Types.QUEUED));
        }
    },

    /**
     *
     */
    changeStateSent: function() {
        if (!this.isSent()) {
            this.state = OutgoingResponse.State.SENT;
            this.dispatchEvent(new ResponseEvent(ResponseEvent.Types.SENT));
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
OutgoingResponse.State = {
    READY: "OutgoingResponse:State:Ready",
    QUEUED: "OutgoingResponse:State:Queued",
    SENT: "OutgoingResponse:State:Sent"
};


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(OutgoingResponse, IObjectable);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.OutgoingResponse', OutgoingResponse);
});
